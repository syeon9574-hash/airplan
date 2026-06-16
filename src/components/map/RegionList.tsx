import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAirData, sidoCache } from '../../hooks/useAirData';
import { REGION_DATA } from '../../constants/regionData';
import { getGrade, getGradeBadgeStyle } from '../../utils/airQuality';
import type { RegionItem } from '../../types';

interface RegionListProps {
  region: string;
}

// 권역별 시도(sidoName) 및 측정소(stationName) 매핑 규칙
const REGION_MAPPING: Record<string, { name: string; sido: string; station: string }[]> = {
  '수도권': [
    { name: '서울 강남', sido: '서울', station: '강남구' },
    { name: '서울 종로', sido: '서울', station: '종로구' },
    { name: '경기 수원', sido: '경기', station: '수원' },
    { name: '경기 성남', sido: '경기', station: '성남' },
    { name: '인천 부평', sido: '인천', station: '부평' },
  ],
  '충청권': [
    { name: '대전 유성', sido: '대전', station: '유성' },
    { name: '세종시',    sido: '세종', station: '세종' },
    { name: '충남 천안', sido: '충남', station: '천안' },
  ],
  '경상권': [
    { name: '부산 해운대', sido: '부산', station: '해운대' },
    { name: '대구 중구',   sido: '대구', station: '중구' },
    { name: '울산 남구',   sido: '울산', station: '남구' },
  ],
  '전라권': [
    { name: '광주 동구', sido: '광주', station: '동구' },
    { name: '전주 완산', sido: '전북', station: '전주' },
  ],
  '제주': [
    { name: '제주시',   sido: '제주', station: '제주시' },
    { name: '서귀포시', sido: '제주', station: '서귀포시' },
  ],
};

export default function RegionList({ region }: RegionListProps) {
  const { fetchSidoData } = useAirData();
  const [list, setList] = useState<RegionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadRealtimeRegionData = async () => {
      const mappings = REGION_MAPPING[region] || [];
      const sidos = Array.from(new Set(mappings.map(m => m.sido)));
      
      // Check if all needed sidos are already cached and fresh (within 5 minutes)
      const CACHE_TTL = 5 * 60 * 1000;
      const allCached = sidos.every(sido => {
        const cached = sidoCache[sido];
        return cached && (Date.now() - cached.timestamp < CACHE_TTL);
      });

      if (!allCached) {
        setIsLoading(true);
      }
      
      try {
        const responses = await Promise.all(
          sidos.map(sido => fetchSidoData(sido))
        );
        
        const sidoDataMap: Record<string, any[]> = {};
        sidos.forEach((sido, idx) => {
          sidoDataMap[sido] = responses[idx] || [];
        });

        const result: RegionItem[] = mappings.map(m => {
          const items = sidoDataMap[m.sido] || [];
          const matchItem = items.find((item: any) => item.stationName === m.station);
          const pm25Val = matchItem ? parseFloat(matchItem.pm25Value) : null;
          
          const fallbackVal = REGION_DATA[region]?.find(r => r.name === m.name)?.pm25 || 15;
          return {
            name: m.name,
            pm25: pm25Val !== null && !isNaN(pm25Val) ? pm25Val : fallbackVal
          };
        });

        if (isMounted) {
          setList(result);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Region realtime load error, fallback to static:', err);
        if (isMounted) {
          setList(REGION_DATA[region] || []);
          setIsLoading(false);
        }
      }
    };

    loadRealtimeRegionData();
    return () => { isMounted = false; };
  }, [region, fetchSidoData]);

  if (isLoading) {
    return (
      <ListWrap id="region-list">
        {[1, 2, 3].map(n => (
          <SkeletonItem key={n}>
            <SkeletonDot />
            <SkeletonText style={{ width: '80px' }} />
            <SkeletonText style={{ width: '40px', marginLeft: 'auto' }} />
            <SkeletonBadge />
          </SkeletonItem>
        ))}
      </ListWrap>
    );
  }

  return (
    <ListWrap id="region-list">
      {list.map((r, i) => {
        const grade = getGrade(r.pm25);
        const badge = getGradeBadgeStyle(r.pm25);
        return (
          <RegionItem key={r.name} style={{ animationDelay: `${i * 0.05}s` }}>
            <RegionDot style={{ background: grade.color }} />
            <RegionName>{r.name}</RegionName>
            <RegionAqi style={{ color: grade.color }}>
              {r.pm25}<RegionUnit>μg/m³</RegionUnit>
            </RegionAqi>
            <RegionGrade style={{ background: badge.bg, color: badge.color }}>
              {grade.label}
            </RegionGrade>
          </RegionItem>
        );
      })}
    </ListWrap>
  );
}

const slideIn = keyframes`
  from { transform: translateY(14px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0 16px;
`;

const RegionItem = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 18px;
  padding: 15px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  animation: ${slideIn} 0.35s ease both;
  transition: transform 0.2s;

  &:active { transform: scale(0.98); }
`;

const RegionDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
`;

const RegionName = styled.div`
  font-size: 14px;
  font-weight: 700;
  flex: 1;
  color: var(--text-primary);
  letter-spacing: -0.1px;
`;

const RegionAqi = styled.div`
  font-size: 15px;
  font-weight: 900;
  display: flex;
  align-items: baseline;
  gap: 3px;
`;

const RegionUnit = styled.span`
  font-size: 10px;
  font-weight: 500;
  opacity: 0.7;
`;

const RegionGrade = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 100px;
`;

const SkeletonItem = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 18px;
  padding: 15px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const SkeletonDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E8E5F5;
`;

const SkeletonText = styled.div`
  height: 14px;
  background: #E8E5F5;
  border-radius: 6px;
`;

const SkeletonBadge = styled.div`
  width: 50px;
  height: 22px;
  border-radius: 100px;
  background: #E8E5F5;
`;
