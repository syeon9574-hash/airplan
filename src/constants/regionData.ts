import type { RegionItem, ForecastItem } from '../types';

export const REGION_DATA: Record<string, RegionItem[]> = {
  '수도권': [
    { name: '서울 강남', pm25: 28 },
    { name: '서울 종로', pm25: 35 },
    { name: '경기 수원', pm25: 18 },
    { name: '경기 성남', pm25: 22 },
    { name: '인천 부평', pm25: 40 },
  ],
  '충청권': [
    { name: '대전 유성', pm25: 15 },
    { name: '세종시',    pm25: 12 },
    { name: '충남 천안', pm25: 25 },
  ],
  '경상권': [
    { name: '부산 해운대', pm25: 10 },
    { name: '대구 중구',   pm25: 32 },
    { name: '울산 남구',   pm25: 19 },
  ],
  '전라권': [
    { name: '광주 동구', pm25: 8 },
    { name: '전주 완산', pm25: 14 },
  ],
  '제주': [
    { name: '제주시',   pm25: 6 },
    { name: '서귀포시', pm25: 5 },
  ],
};

export const REGION_TABS = ['수도권', '충청권', '경상권', '전라권', '제주'];

export const FORECAST_DUMMY: ForecastItem[] = [
  { time: '06시', pm25: 18 },
  { time: '09시', pm25: 32 },
  { time: '12시', pm25: 28 },
  { time: '15시', pm25: 55 },
  { time: '18시', pm25: 42 },
  { time: '21시', pm25: 22 },
  { time: '24시', pm25: 15 },
];

// ── 날짜 헬퍼 함수 ───────────────────────────
const getTodayString = (daysAgo = 0) => {
  const d = new Date();
  if (daysAgo > 0) {
    d.setDate(d.getDate() - daysAgo);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getCurrentHourString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:00`;
};

// ── 폴백 더미 데이터 ─────────────────────────
export const FALLBACK = {
  pm25: 28,
  pm10: 45,
  o3: 0.042,
  no2: 0.028,
  dataTime: getCurrentHourString(),
};

export const FALLBACK_ALARMS = [
  {
    issueDate: getTodayString(0), issueTime: '10:30',
    area: '서울', issueGbn: '주의보',
    pollutant: '미세먼지(PM2.5)', causeType: '', clearYn: 'N' as const,
  },
  {
    issueDate: getTodayString(0), issueTime: '08:00',
    area: '경기', issueGbn: '경보',
    pollutant: '초미세먼지(PM10)', causeType: '', clearYn: 'N' as const,
  },
];

