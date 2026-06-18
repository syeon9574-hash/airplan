import { useCallback, useRef } from 'react';
import { useAppContext } from '../store/appContext';
import { API_KEY, REALTIME_URL, ALARM_URL, CORS_PROXY, DEFAULT_STATION, SIDO_URL } from '../constants/api';
import { FALLBACK, FALLBACK_ALARMS } from '../constants/regionData';
import type { Alarm } from '../types';

// ── 글로벌 시도 데이터 캐시 ──────────────────
export const sidoCache: Record<string, { data: any[]; timestamp: number }> = {};

// ── 타임아웃 지원 fetch 헬퍼 ──────────────────
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 1200) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ── API 호출 헬퍼 (CORS Proxy fallback) ──────
async function apiGet(url: string, params: Record<string, string | number>) {
  const qs = new URLSearchParams({
    serviceKey: API_KEY,
    _type: 'json',
    returnType: 'json',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  });
  const direct = `${url}?${qs}`;
  const proxied = `${CORS_PROXY}${encodeURIComponent(direct)}`;

  try {
    const res = await fetchWithTimeout(direct, { mode: 'cors' }, 1200);
    if (!res.ok) throw new Error(`direct ${res.status}`);
    return res.json();
  } catch {
    const res = await fetchWithTimeout(proxied, {}, 1200);
    if (!res.ok) throw new Error(`proxy ${res.status}`);
    return res.json();
  }
}

// ── useAirData 훅 ─────────────────────────────
export function useAirData() {
  const { setAppState, settings } = useAppContext();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRealtime = useCallback(async (location?: string) => {
    const rawStation = location || settings.location || DEFAULT_STATION;
    const station = rawStation.includes(' ') ? rawStation.split(' ')[1] : rawStation;
    setAppState(prev => ({ ...prev, apiStatus: 'loading', apiMessage: '실시간 데이터 불러오는 중…' }));
    try {
      const data = await apiGet(REALTIME_URL, {
        stationName: station,
        dataTerm: 'DAILY',
        pageNo: 1,
        numOfRows: 1,
        ver: '1.0',
      });
      const item = data?.response?.body?.items?.item;
      const row = Array.isArray(item) ? item[0] : item;
      if (!row) throw new Error('no data');

      setAppState(prev => ({
        ...prev,
        pm25: parseFloat(row.pm25Value) || FALLBACK.pm25,
        pm10: parseFloat(row.pm10Value) || FALLBACK.pm10,
        o3: parseFloat(row.o3Value) || 0,
        no2: parseFloat(row.no2Value) || 0,
        dataTime: row.dataTime || '',
        apiOk: true,
        apiStatus: 'ok',
        apiMessage: `✅ 실시간 데이터 (${row.dataTime || ''})`,
      }));
    } catch (e) {
      console.warn('[API] 실시간 측정 실패, 더미 사용:', e);
      setAppState(prev => ({
        ...prev,
        pm25: FALLBACK.pm25,
        pm10: FALLBACK.pm10,
        dataTime: FALLBACK.dataTime,
        apiOk: false,
        apiStatus: 'error',
        apiMessage: '⚠️ API 연결 실패 — 샘플 데이터로 표시 중',
      }));
    }
  }, [setAppState, settings.location]);

  const fetchAlarms = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear();
      const data = await apiGet(ALARM_URL, { numOfRows: 300, pageNo: 1, year: currentYear });
      const items = data?.response?.body?.items || data?.response?.body?.items?.item;
      if (!items) throw new Error('no alarm data');
      const rawAlarms = Array.isArray(items) ? items : [items];
      
      // Sort descending (newest first) by issueDate + issueTime
      const sortedRawAlarms = [...rawAlarms].sort((a: any, b: any) => {
        const dateA = `${a.issueDate || ''} ${a.issueTime || ''}`;
        const dateB = `${b.issueDate || ''} ${b.issueTime || ''}`;
        return dateB.localeCompare(dateA);
      });

      const alarms: Alarm[] = sortedRawAlarms.map((item: any) => {
        const areaName = item.districtName && item.moveName 
          ? `${item.districtName} (${item.moveName})` 
          : (item.districtName || item.area || '전국');
        return {
          issueDate: item.issueDate || '',
          issueTime: item.issueTime || '',
          area: areaName,
          moveName: item.moveName || '',
          issueGbn: item.issueGbn || '주의보',
          pollutant: item.itemCode === 'PM10' ? '미세먼지(PM10)' : (item.itemCode === 'PM25' ? '초미세먼지(PM2.5)' : item.itemCode),
          itemCode: item.itemCode || '',
          clearYn: ((item.clearDate || item.clearTime || item.clearYn === 'Y') ? 'Y' : 'N') as 'Y' | 'N',
        };
      });

      setAppState(prev => ({ ...prev, alarms }));
    } catch (e) {
      console.warn('[API] 경보 조회 실패, 더미 사용:', e);
      setAppState(prev => ({ ...prev, alarms: FALLBACK_ALARMS }));
    }
  }, [setAppState]);

  const fetchAll = useCallback(async (location?: string) => {
    await Promise.all([fetchRealtime(location), fetchAlarms()]);
  }, [fetchRealtime, fetchAlarms]);

  const startAutoRefresh = useCallback(() => {
    fetchAll();
    timerRef.current = setInterval(() => fetchAll(), 5 * 60 * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchAll]);

  const fetchSidoData = useCallback(async (sidoName: string) => {
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    const cached = sidoCache[sidoName];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const data = await apiGet(SIDO_URL, {
        sidoName,
        searchCondition: 'HOUR',
        pageNo: 1,
        numOfRows: 100,
        ver: '1.0',
      });
      const items = data?.response?.body?.items;
      if (!items) throw new Error('no items');
      const result = Array.isArray(items) ? items : [items];
      sidoCache[sidoName] = { data: result, timestamp: Date.now() };
      return result;
    } catch (e) {
      console.warn(`[API] ${sidoName} 시도별 측정 데이터 조회 실패:`, e);
      // Fail cache to avoid immediate retries
      sidoCache[sidoName] = { data: [], timestamp: Date.now() - CACHE_TTL + 30000 };
      return [];
    }
  }, []);

  return { fetchAll, fetchRealtime, fetchAlarms, startAutoRefresh, fetchSidoData };
}
