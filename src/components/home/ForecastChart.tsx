import styled from 'styled-components';
import { Clock } from 'lucide-react';
import { FORECAST_DUMMY } from '../../constants/regionData';
import { getPersonalizedGrade } from '../../utils/airQuality';
import { useAppContext } from '../../store/appContext';

export default function ForecastChart() {
  const { settings } = useAppContext();
  const max = Math.max(...FORECAST_DUMMY.map(f => f.pm25));

  return (
    <>
      <SectionTitleRow>
        <SectionTitle>
          <Clock size={16} color="#7B6EE8" style={{ marginRight: 6 }} /> 시간대별 PM2.5 예측
        </SectionTitle>
        <LegendRow>
          <LegendItem><LegendDot style={{ background: '#6BCB8B' }} />좋음</LegendItem>
          <LegendItem><LegendDot style={{ background: '#F5B944' }} />보통</LegendItem>
          <LegendItem><LegendDot style={{ background: '#FF8C7A' }} />나쁨</LegendItem>
          <LegendItem><LegendDot style={{ background: '#FF7FAB' }} />매우나쁨</LegendItem>
        </LegendRow>
      </SectionTitleRow>
      <ForecastScroll>
        <ForecastInner id="forecast-inner">
          {FORECAST_DUMMY.map((f, i) => {
            const h = Math.max(20, Math.round((f.pm25 / max) * 68));
            const grade = getPersonalizedGrade(f.pm25, settings.sensitivity);
            return (
              <ForecastItem key={i}>
                <BarWrap>
                  <Bar style={{ height: `${h}px`, background: grade.color }} />
                </BarWrap>
                <ForecastTime>{f.time}</ForecastTime>
                <ForecastVal style={{ color: grade.color }}>{f.pm25}</ForecastVal>
              </ForecastItem>
            );
          })}
        </ForecastInner>
      </ForecastScroll>
    </>
  );
}

const SectionTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 4px 0 12px 20px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
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

const ForecastScroll = styled.div`
  overflow-x: auto;
  padding: 4px 16px 18px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ForecastInner = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 16px 18px 12px;
  box-shadow: var(--shadow-sm);
`;

const ForecastItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 48px;
`;

const BarWrap = styled.div`
  height: 72px;
  display: flex;
  align-items: flex-end;
`;

const Bar = styled.div`
  width: 26px;
  border-radius: 8px 8px 0 0;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.85;
`;

const ForecastTime = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
`;

const ForecastVal = styled.div`
  font-size: 11px;
  font-weight: 800;
`;
