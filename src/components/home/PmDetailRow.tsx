import styled, { keyframes } from 'styled-components';
import { getGrade, getGradeBadgeStyle } from '../../utils/airQuality';

interface PmDetailRowProps {
  pm25: number;
  pm10: number;
}

export default function PmDetailRow({ pm25, pm10 }: PmDetailRowProps) {
  const pm25Grade = getGrade(pm25);
  const pm10Grade = getGrade(Math.round(pm10 / 2));
  const pm25Badge = getGradeBadgeStyle(pm25);
  const pm10Badge = getGradeBadgeStyle(Math.round(pm10 / 2));

  const pm25Pct = Math.min(100, Math.round((pm25 / 75) * 100));
  const pm10Pct = Math.min(100, Math.round((pm10 / 150) * 100));

  return (
    <Row>
      <PmCard>
        <PmTop>
          <PmLabel>PM2.5</PmLabel>
          <PmGrade id="pm25-grade" style={{ background: pm25Badge.bg, color: pm25Badge.color }}>
            {pm25Grade.label}
          </PmGrade>
        </PmTop>
        <PmValue id="pm25-value" style={{ color: pm25Grade.color }}>{pm25}</PmValue>
        <PmUnit>μg/m³</PmUnit>
        <ProgressTrack>
          <ProgressFill style={{ width: `${pm25Pct}%`, background: pm25Grade.color }} />
        </ProgressTrack>
      </PmCard>
      <PmCard>
        <PmTop>
          <PmLabel>PM10</PmLabel>
          <PmGrade id="pm10-grade" style={{ background: pm10Badge.bg, color: pm10Badge.color }}>
            {pm10Grade.label}
          </PmGrade>
        </PmTop>
        <PmValue id="pm10-value" style={{ color: pm10Grade.color }}>{pm10}</PmValue>
        <PmUnit>μg/m³</PmUnit>
        <ProgressTrack>
          <ProgressFill style={{ width: `${pm10Pct}%`, background: pm10Grade.color }} />
        </ProgressTrack>
      </PmCard>
    </Row>
  );
}

const fillAnim = keyframes`
  from { width: 0%; }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
`;

const PmCard = styled.div`
  flex: 1;
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 18px 16px 14px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;

  &:active { transform: scale(0.97); }
`;

const PmTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const PmLabel = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const PmValue = styled.div`
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1;
`;

const PmUnit = styled.div`
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  font-weight: 500;
`;

const ProgressTrack = styled.div`
  margin-top: 10px;
  height: 5px;
  background: rgba(139, 126, 248, 0.10);
  border-radius: 100px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 100px;
  opacity: 0.75;
  animation: ${fillAnim} 1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const PmGrade = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
`;

