import styled from 'styled-components';
import { Compass, Ban, CheckCircle, Cpu } from 'lucide-react';
import { FORECAST_DUMMY } from '../../constants/regionData';
import { useAppContext } from '../../store/appContext';
import { getPersonalizedGrade } from '../../utils/airQuality';

export default function SmartTimelineGuide() {
  const { settings } = useAppContext();

  // ── 대기 예측 데이터를 기반으로 한 행동 추천 분석 ──────────────────
  
  // 1. 외출 자제 구간 분석 (초미세먼지가 '나쁨' 이상이 되는 구간)
  const badItems = FORECAST_DUMMY.filter(f => {
    const grade = getPersonalizedGrade(f.pm25, settings.sensitivity);
    return grade.key === 'bad' || grade.key === 'very-bad';
  });
  
  // 2. 최적의 외출 시간 분석 (초미세먼지 수치가 가장 낮은 대표 시간대)
  const sortedForecast = [...FORECAST_DUMMY].sort((a, b) => a.pm25 - b.pm25);
  const bestItem = sortedForecast[0];

  // 3. 공기청정기 가동 가이드 (수치가 보통 -> 나쁨으로 넘어가거나 급증하는 시기)
  let transitionItem = FORECAST_DUMMY.find((f, idx) => {
    if (idx === 0) return false;
    const prev = FORECAST_DUMMY[idx - 1];
    const prevGrade = getPersonalizedGrade(prev.pm25, settings.sensitivity);
    const currGrade = getPersonalizedGrade(f.pm25, settings.sensitivity);
    return (prevGrade.key === 'good' || prevGrade.key === 'moderate') && 
           (currGrade.key === 'bad' || currGrade.key === 'very-bad');
  });

  // 매칭되는 항목이 없으면 정체 예상 시간대로 대체
  if (!transitionItem) {
    transitionItem = FORECAST_DUMMY.find(f => f.time === '18시') || FORECAST_DUMMY[3];
  }

  // ── 시간대 문자열 포맷팅 ───────────────────────────────────
  const badRange = badItems.length > 0 
    ? `[${badItems[0].time.replace('시', ':00')} ~ ${badItems[badItems.length - 1].time.replace('시', ':00')}]`
    : '[14:00 ~ 17:00]';

  const bestHour = bestItem ? parseInt(bestItem.time.replace('시', ''), 10) : 9;
  const bestRange = `[${String(bestHour).padStart(2, '0')}:00 ~ ${String((bestHour + 2) % 24).padStart(2, '0')}:00]`;

  const transitionHour = transitionItem ? parseInt(transitionItem.time.replace('시', ''), 10) : 18;
  const transitionRange = `[${String(transitionHour).padStart(2, '0')}:00 ~ ${String((transitionHour + 3) % 24).padStart(2, '0')}:00]`;

  return (
    <>
      <SectionTitle>
        <Compass size={18} color="#7B6EE8" style={{ marginRight: 6 }} /> 대기 예측 맞춤 행동 가이드
      </SectionTitle>
      
      <GuideContainer id="smart-timeline-guide">
        {/* 외출 자제 구간 카드 */}
        <GuideCard $type="bad">
          <IconWrapper $type="bad">
            <Ban size={20} />
          </IconWrapper>
          <Content>
            <GuideTitle $type="bad">외출 자제 권장 시간대</GuideTitle>
            <TimeText $type="bad">{badRange}</TimeText>
            <Description>
              미세먼지 수치가 급증하여 호흡기에 해롭습니다. 야외 활동을 가급적 자제하고 실내 일정을 권장해요.
            </Description>
          </Content>
        </GuideCard>

        {/* 최적의 외출 시간 카드 */}
        <GuideCard $type="good">
          <IconWrapper $type="good">
            <CheckCircle size={20} />
          </IconWrapper>
          <Content>
            <GuideTitle $type="good">최적의 외출/환기 골든타임</GuideTitle>
            <TimeText $type="good">{bestRange}</TimeText>
            <Description>
              오늘 대기 질이 가장 쾌적한 보너스 타임! 가벼운 실외 산책이나 맞통풍 환기를 추천합니다.
            </Description>
          </Content>
        </GuideCard>

        {/* 공기청정기 가동 가이드 카드 */}
        <GuideCard $type="purify">
          <IconWrapper $type="purify">
            <Cpu size={20} />
          </IconWrapper>
          <Content>
            <GuideTitle $type="purify">공기청정기 집중 가동 가이드</GuideTitle>
            <TimeText $type="purify">{transitionRange}</TimeText>
            <Description>
              외부 대기 정체 현상으로 공기 오염도가 상승 중입니다. 실내 창문을 닫고 공기청정기를 집중 가동하세요.
            </Description>
          </Content>
        </GuideCard>
      </GuideContainer>
    </>
  );
}

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 8px 20px 12px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
`;

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
`;

type CardType = 'good' | 'bad' | 'purify';

const getCardStyle = (type: CardType) => {
  switch (type) {
    case 'bad':
      return {
        border: 'rgba(217, 91, 69, 0.25)',
        background: 'linear-gradient(135deg, rgba(255, 243, 243, 0.6) 0%, rgba(255, 235, 235, 0.8) 100%)',
        title: '#D95B45',
        text: 'rgba(217, 91, 69, 0.1)',
        darkBg: 'linear-gradient(135deg, rgba(34, 15, 15, 0.6) 0%, rgba(46, 20, 20, 0.8) 100%)',
        darkBorder: 'rgba(217, 91, 69, 0.15)',
      };
    case 'good':
      return {
        border: 'rgba(61, 160, 106, 0.25)',
        background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.6) 0%, rgba(220, 252, 231, 0.8) 100%)',
        title: '#3DA06A',
        text: 'rgba(61, 160, 106, 0.1)',
        darkBg: 'linear-gradient(135deg, rgba(15, 34, 23, 0.6) 0%, rgba(20, 46, 31, 0.8) 100%)',
        darkBorder: 'rgba(61, 160, 106, 0.15)',
      };
    case 'purify':
      default:
      return {
        border: 'rgba(123, 110, 232, 0.25)',
        background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.6) 0%, rgba(237, 233, 254, 0.8) 100%)',
        title: '#7B6EE8',
        text: 'rgba(123, 110, 232, 0.1)',
        darkBg: 'linear-gradient(135deg, rgba(20, 15, 46, 0.6) 0%, rgba(28, 20, 64, 0.8) 100%)',
        darkBorder: 'rgba(123, 110, 232, 0.15)',
      };
  }
};

const GuideCard = styled.div<{ $type: CardType }>`
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1.5px solid ${({ $type }) => getCardStyle($type).border};
  background: ${({ $type }) => getCardStyle($type).background};

  [data-theme='dark'] & {
    background: ${({ $type }) => getCardStyle($type).darkBg};
    border-color: ${({ $type }) => getCardStyle($type).darkBorder};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(123, 110, 232, 0.06);
  }
`;

const IconWrapper = styled.div<{ $type: CardType }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $type }) => getCardStyle($type).title};
  background: ${({ $type }) => getCardStyle($type).text};

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const GuideTitle = styled.div<{ $type: CardType }>`
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: ${({ $type }) => getCardStyle($type).title};

  [data-theme='dark'] & {
    color: var(--text-primary);
  }
`;

const TimeText = styled.div<{ $type: CardType }>`
  font-size: 13px;
  font-weight: 800;
  color: ${({ $type }) => getCardStyle($type).title};
  font-family: monospace, system-ui;
  letter-spacing: 0.1px;

  [data-theme='dark'] & {
    color: ${({ $type }) => getCardStyle($type).title};
    opacity: 0.95;
  }
`;

const Description = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.45;
  font-weight: 500;
  margin-top: 2px;
`;
