import styled, { keyframes } from 'styled-components';
import { BarChart3, Activity, AlertTriangle, Leaf, Footprints } from 'lucide-react';

// 지난 7일 가상 데이터 (더미)
const WEEKLY_DATA = [
  { day: '월', pm25: 18 },
  { day: '화', pm25: 32 },
  { day: '수', pm25: 55 },
  { day: '목', pm25: 41 },
  { day: '금', pm25: 28 },
  { day: '토', pm25: 12 },
  { day: '일', pm25: 22 },
];

function getWeekColor(pm25: number): string {
  if (pm25 <= 15) return '#6BCB8B';
  if (pm25 <= 35) return '#F5B944';
  if (pm25 <= 75) return '#FF8C7A';
  return '#FF7FAB';
}

export default function WeeklyInsight() {
  const avg = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.pm25, 0) / WEEKLY_DATA.length);
  const worst = WEEKLY_DATA.reduce((a, b) => a.pm25 > b.pm25 ? a : b);
  const best = WEEKLY_DATA.reduce((a, b) => a.pm25 < b.pm25 ? a : b);
  const goodDays = WEEKLY_DATA.filter(d => d.pm25 <= 35).length;
  const maxPm25 = Math.max(...WEEKLY_DATA.map(d => d.pm25));

  return (
    <>
      <SectionTitle>
        <BarChart3 size={18} color="#7B6EE8" style={{ marginRight: 6 }} /> 이번 주 공기질 분석
      </SectionTitle>
      <Wrapper>
        {/* 7일 미니 바 차트 */}
        <BarCard>
          <BarCardHeader>
            <BarCardTitle>7일 PM2.5 추이</BarCardTitle>
            <LegendRow>
              <LegendItem><LegendDot style={{ background: '#6BCB8B' }} />좋음</LegendItem>
              <LegendItem><LegendDot style={{ background: '#F5B944' }} />보통</LegendItem>
              <LegendItem><LegendDot style={{ background: '#FF8C7A' }} />나쁨</LegendItem>
              <LegendItem><LegendDot style={{ background: '#FF7FAB' }} />매우나쁨</LegendItem>
            </LegendRow>
          </BarCardHeader>
          <MiniBarGroup>
            {WEEKLY_DATA.map((d, i) => {
              const h = Math.max(8, Math.round((d.pm25 / maxPm25) * 40));
              return (
                <MiniBarItem key={i}>
                  <MiniBarWrap>
                    <MiniBar style={{ height: `${h}px`, background: getWeekColor(d.pm25) }} />
                  </MiniBarWrap>
                  <MiniBarDay>{d.day}</MiniBarDay>
                </MiniBarItem>
              );
            })}
          </MiniBarGroup>
        </BarCard>

        {/* 통계 카드들 */}
        <StatRow>
          <StatCard $color="#8B7EF8">
            <StatIconWrap>
              <Activity size={15} color="#8B7EF8" />
            </StatIconWrap>
            <StatValue>{avg}</StatValue>
            <StatUnit>μg/m³</StatUnit>
            <StatLabel>주간 평균</StatLabel>
          </StatCard>

          <StatCard $color={getWeekColor(worst.pm25)}>
            <StatIconWrap>
              <AlertTriangle size={15} color={getWeekColor(worst.pm25)} />
            </StatIconWrap>
            <StatValue style={{ color: getWeekColor(worst.pm25) }}>{worst.day}요일</StatValue>
            <StatUnit style={{ color: getWeekColor(worst.pm25) }}>{worst.pm25}μg</StatUnit>
            <StatLabel>최악의 날</StatLabel>
          </StatCard>

          <StatCard $color={getWeekColor(best.pm25)}>
            <StatIconWrap>
              <Leaf size={15} color={getWeekColor(best.pm25)} />
            </StatIconWrap>
            <StatValue style={{ color: getWeekColor(best.pm25) }}>{best.day}요일</StatValue>
            <StatUnit style={{ color: getWeekColor(best.pm25) }}>{best.pm25}μg</StatUnit>
            <StatLabel>최선의 날</StatLabel>
          </StatCard>

          <StatCard $color="#6BCB8B">
            <StatIconWrap>
              <Footprints size={15} color="#6BCB8B" />
            </StatIconWrap>
            <StatValue style={{ color: '#6BCB8B' }}>{goodDays}일</StatValue>
            <StatUnit>/ 7일</StatUnit>
            <StatLabel>외출 적합일</StatLabel>
          </StatCard>
        </StatRow>
      </Wrapper>
    </>
  );
}

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 4px 20px 12px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
  span { font-size: 17px; }
`;

const Wrapper = styled.div`
  padding: 0 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeSlide} 0.5s ease both;
`;

const BarCard = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 16px 18px 14px;
  box-shadow: var(--shadow-sm);
`;

const BarCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BarCardTitle = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
`;

const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
`;

const MiniBarGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-end;
  justify-content: space-between;
`;

const MiniBarItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

const MiniBarWrap = styled.div`
  height: 44px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  justify-content: center;
`;

const MiniBar = styled.div`
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.88;
  min-height: 6px;
`;

const MiniBarDay = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 16px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  box-shadow: var(--shadow-sm);
  text-align: center;
  border-top: 2.5px solid ${({ $color }) => $color};
`;

const StatIconWrap = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #8B7EF8;
  letter-spacing: -0.3px;
  line-height: 1;
`;

const StatUnit = styled.div`
  font-size: 9px;
  color: var(--text-muted);
  font-weight: 600;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-top: 2px;
  letter-spacing: -0.1px;
`;
