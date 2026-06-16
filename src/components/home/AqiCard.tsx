import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { MapPin, Wifi, CloudAlert } from 'lucide-react';
import { getPersonalizedGrade, getGradeGradient } from '../../utils/airQuality';

interface AqiCardProps {
  pm25: number;
  dataTime: string;
  apiOk: boolean;
  location: string;
  sensitivity: string;
}

export default function AqiCard({ pm25, dataTime, apiOk, location, sensitivity }: AqiCardProps) {
  const grade = getPersonalizedGrade(pm25, sensitivity);
  const numberRef = useRef<HTMLDivElement>(null);
  const prevPm25 = useRef(pm25);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;
    const from = prevPm25.current;
    const target = pm25;
    prevPm25.current = pm25;
    const dur = 900;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = String(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [pm25]);

  return (
    <Card id="aqi-card" $gradient={getGradeGradient(grade.cssClass)}>
      {/* 장식용 원 */}
      <Deco1 />
      <Deco2 />
      <Deco3 />

      <AqiLocation id="aqi-location">
        <MapPin size={13} strokeWidth={2.5} style={{ marginRight: 3 }} /> {location}
      </AqiLocation>
      <AqiNumber id="aqi-number" ref={numberRef}>{pm25}</AqiNumber>
      <AqiUnit>μg/m³</AqiUnit>
      <AqiLabel id="aqi-label">PM2.5 기준 — {grade.label}</AqiLabel>
      <AqiDesc id="aqi-updated">
        {dataTime && dataTime !== '데이터 없음 (더미)' ? `${dataTime} 기준` : '데이터 준비 중'}
      </AqiDesc>
      <AqiFooter>
        <AqiSource id="aqi-source">
          {apiOk ? (
            <SourceContent>
              <Wifi size={11} style={{ marginRight: 4 }} /> 에어코리아 실시간
            </SourceContent>
          ) : (
            <SourceContent>
              <CloudAlert size={11} style={{ marginRight: 4 }} /> 샘플 데이터
            </SourceContent>
          )}
        </AqiSource>
        <AqiBadge id="aqi-badge">{grade.label}</AqiBadge>
      </AqiFooter>
    </Card>
  );
}

// ── keyframes ────────────────────────────────
const countUp = keyframes`
  from { opacity: 0; transform: scale(0.7) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-6px) scale(1.02); }
`;

// ── styled-components ────────────────────────
const Card = styled.div<{ $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  color: white;
  border: none;
  border-radius: 26px;
  padding: 28px 26px 24px;
  margin: 0 16px 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  transition: background 0.6s ease;
  animation: ${float} 6s ease-in-out infinite;
`;

/* 배경 장식 원 */
const Deco1 = styled.div`
  position: absolute;
  top: -50px; right: -50px;
  width: 200px; height: 200px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
`;

const Deco2 = styled.div`
  position: absolute;
  bottom: -70px; left: -30px;
  width: 240px; height: 240px;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 50%;
`;

const Deco3 = styled.div`
  position: absolute;
  top: 50%; right: 20px;
  transform: translateY(-50%);
  width: 80px; height: 80px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
`;

const AqiLocation = styled.div`
  font-size: 13px;
  opacity: 0.88;
  margin-bottom: 6px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AqiNumber = styled.div`
  font-size: 84px;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -5px;
  position: relative;
  z-index: 1;
  animation: ${countUp} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
`;

const AqiUnit = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.75;
  margin-top: 2px;
  position: relative;
  z-index: 1;
`;

const AqiLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  opacity: 0.95;
  margin-top: 8px;
  position: relative;
  z-index: 1;
`;

const AqiDesc = styled.div`
  font-size: 12px;
  opacity: 0.70;
  margin-top: 4px;
  position: relative;
  z-index: 1;
  font-weight: 500;
`;

const AqiFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  position: relative;
  z-index: 1;
`;

const AqiSource = styled.div`
  font-size: 11px;
  opacity: 0.72;
  font-weight: 500;
`;

const AqiBadge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.30);
  backdrop-filter: blur(8px);
  border-radius: 100px;
  padding: 5px 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const SourceContent = styled.div`
  display: flex;
  align-items: center;
`;

