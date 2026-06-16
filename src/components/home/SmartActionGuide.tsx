import styled from 'styled-components';
import { Compass, ShieldAlert, Wind } from 'lucide-react';
import { FORECAST_DUMMY } from '../../constants/regionData';
import { useAppContext } from '../../store/appContext';
import { getPersonalizedGrade } from '../../utils/airQuality';

export default function SmartActionGuide() {
  const { settings, appState } = useAppContext();
  const pm25 = appState.pm25;
  const sensitivity = settings.sensitivity;

  const currentGrade = getPersonalizedGrade(pm25, sensitivity);
  const isVulnerable = sensitivity !== 'normal';

  // ── 1. 실시간 핵심 수칙 (기존 ActionList 병합) ──────────────────
  const maskStatus = 
    currentGrade.key === 'good' ? { status: '마스크 불필요', desc: '맑은 공기를 만끽하세요', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)' } :
    currentGrade.key === 'moderate' ? { 
      status: isVulnerable ? '보건용 KF80+ 권장' : '민감군 KF80 권장', 
      desc: isVulnerable ? '호흡기를 적극 보호하세요' : '장시간 외출 시 착용 권장', 
      color: '#CA8A04', 
      bg: 'rgba(202, 138, 4, 0.08)' 
    } :
    { status: 'KF94 착용 필수', desc: '외출 시 반드시 밀착 착용', color: '#E11D48', bg: 'rgba(225, 29, 72, 0.08)' };

  const ventStatus = 
    currentGrade.key === 'good' ? { status: '자유롭게 환기 가능', desc: '실내 공기를 자주 순환시키세요', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)' } :
    currentGrade.key === 'moderate' ? { status: '짧은 환기 추천', desc: '오전 중 10-15분씩 나누어 환기', color: '#CA8A04', bg: 'rgba(202, 138, 4, 0.08)' } :
    { status: '자연 환기 자제', desc: '창문을 닫고 공기청정기 항시 가동', color: '#E11D48', bg: 'rgba(225, 29, 72, 0.08)' };

  // ── 2. 대기 예측 데이터 기반 시간대별 분석 ──────────────────
  
  // 외출 자제 구간 (초미세먼지 '나쁨' 이상)
  const badItems = FORECAST_DUMMY.filter(f => {
    const grade = getPersonalizedGrade(f.pm25, sensitivity);
    return grade.key === 'bad' || grade.key === 'very-bad';
  });
  
  // 최적의 외출 시간 (PM2.5가 가장 낮은 시간대)
  const sortedForecast = [...FORECAST_DUMMY].sort((a, b) => a.pm25 - b.pm25);
  const bestItem = sortedForecast[0];

  // 공기청정기 집중 가동 (보통 -> 나쁨 전환 혹은 외부 정체 시기)
  let transitionItem = FORECAST_DUMMY.find((f, idx) => {
    if (idx === 0) return false;
    const prev = FORECAST_DUMMY[idx - 1];
    const prevGrade = getPersonalizedGrade(prev.pm25, sensitivity);
    const currGrade = getPersonalizedGrade(f.pm25, sensitivity);
    return (prevGrade.key === 'good' || prevGrade.key === 'moderate') && 
           (currGrade.key === 'bad' || currGrade.key === 'very-bad');
  });

  if (!transitionItem) {
    transitionItem = FORECAST_DUMMY.find(f => f.time === '18시') || FORECAST_DUMMY[3];
  }

  // ── 시간 계산 및 포맷팅 ──────────────────
  const badHour = badItems.length > 0 ? parseInt(badItems[0].time.replace('시', ''), 10) : 14;
  const badEndHour = badItems.length > 0 ? parseInt(badItems[badItems.length - 1].time.replace('시', ''), 10) : 17;
  const badRange = `${String(badHour).padStart(2, '0')}:00 - ${String(badEndHour).padStart(2, '0')}:00`;

  const bestHour = bestItem ? parseInt(bestItem.time.replace('시', ''), 10) : 9;
  const bestRange = `${String(bestHour).padStart(2, '0')}:00 - ${String((bestHour + 2) % 24).padStart(2, '0')}:00`;

  let transitionHour = transitionItem ? parseInt(transitionItem.time.replace('시', ''), 10) : 18;
  if (transitionHour === badHour) {
    transitionHour = badEndHour;
  }
  const transitionRange = `${String(transitionHour).padStart(2, '0')}:00 - ${String((transitionHour + 3) % 24).padStart(2, '0')}:00`;

  // ── 타임라인 아이템 리스트 생성 및 시간대 순 정렬 ──────────────────
  const timelineItems = [
    {
      id: 'best',
      type: 'good' as const,
      hour: bestHour,
      timeRange: bestRange,
      indicator: '🟢',
      label: '환기/산책 추천',
      title: '최적의 외출/환기 골든타임',
      desc: '오늘 대기 질이 가장 쾌적한 보너스 타임! 가벼운 실외 산책이나 맞통풍 환기를 추천합니다.'
    },
    {
      id: 'bad',
      type: 'bad' as const,
      hour: badHour,
      timeRange: badRange,
      indicator: '🔴',
      label: '야외활동 자제',
      title: '외출 자제 권장 시간대',
      desc: '미세먼지 수치가 급증하여 호흡기에 해롭습니다. 야외 활동을 가급적 자제하고 실내 일정을 권장해요.'
    },
    {
      id: 'purify',
      type: 'purify' as const,
      hour: transitionHour,
      timeRange: transitionRange,
      indicator: '🟡',
      label: '공기청정기 가동',
      title: '공기청정기 집중 가동 가이드',
      desc: '외부 대기 정체 현상으로 공기 오염도가 상승 중입니다. 실내 창문을 닫고 공기청정기를 집중 가동하세요.'
    }
  ];

  // 시간순(오름차순) 정렬
  timelineItems.sort((a, b) => a.hour - b.hour);

  return (
    <>
      <SectionTitle>
        <Compass size={18} color="#7B6EE8" style={{ marginRight: 6 }} /> 오늘의 맞춤 행동 가이드
      </SectionTitle>

      {/* 실시간 핵심 수칙 카드 Grid */}
      <QuickRulesGrid>
        <RuleCard style={{ background: maskStatus.bg, borderColor: maskStatus.color }}>
          <RuleIconWrapper style={{ color: maskStatus.color }}>
            <ShieldAlert size={20} />
          </RuleIconWrapper>
          <RuleContent>
            <RuleLabel>실시간 마스크</RuleLabel>
            <RuleStatus style={{ color: maskStatus.color }}>{maskStatus.status}</RuleStatus>
            <RuleDesc>{maskStatus.desc}</RuleDesc>
          </RuleContent>
        </RuleCard>

        <RuleCard style={{ background: ventStatus.bg, borderColor: ventStatus.color }}>
          <RuleIconWrapper style={{ color: ventStatus.color }}>
            <Wind size={20} />
          </RuleIconWrapper>
          <RuleContent>
            <RuleLabel>실내 환기 가이드</RuleLabel>
            <RuleStatus style={{ color: ventStatus.color }}>{ventStatus.status}</RuleStatus>
            <RuleDesc>{ventStatus.desc}</RuleDesc>
          </RuleContent>
        </RuleCard>
      </QuickRulesGrid>

      {/* 시간대별 예보 맞춤 타임블록 */}
      <SubTitle>시간대별 예보 맞춤 타임블록</SubTitle>
      <TimelineContainer id="smart-timeline-guide">
        <TimelineTrack />
        {timelineItems.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineDot $type={item.type} />
            <GuideCard $type={item.type}>
              <CardHeader>
                <TimeBadge $type={item.type}>
                  {item.timeRange}
                </TimeBadge>
                <StatusTag $type={item.type}>
                  {item.indicator} {item.label}
                </StatusTag>
              </CardHeader>
              <GuideTitle $type={item.type}>{item.title}</GuideTitle>
              <Description>{item.desc}</Description>
            </GuideCard>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </>
  );
}

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 16px 20px 12px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 8px 20px 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickRulesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 16px 8px;
`;

const RuleCard = styled.div`
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border: 1.5px solid;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const RuleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const RuleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RuleLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  opacity: 0.8;
`;

const RuleStatus = styled.div`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const RuleDesc = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.3;
  margin-top: 2px;
  font-weight: 500;
`;

const TimelineContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px 16px 36px;
  margin-bottom: 8px;
`;

const TimelineTrack = styled.div`
  position: absolute;
  left: 20px;
  top: 10px;
  bottom: 30px;
  width: 2.5px;
  background: linear-gradient(to bottom, #E8E3FA 0%, #D2C9F7 100%);
  border-radius: 2px;

  [data-theme='dark'] & {
    background: #463E6E;
  }
`;

const TimelineItem = styled.div`
  position: relative;
`;

type CardType = 'good' | 'bad' | 'purify';

const getCardStyle = (type: CardType) => {
  switch (type) {
    case 'bad':
      return {
        border: '#FFCDD2',
        background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
        title: '#E11D48',
        badgeBg: '#FFE4E6',
        badgeBorder: '#FCA5A5',
        dot: '#E11D48',
        darkBg: 'linear-gradient(135deg, #2D1415 0%, #1F0D0E 100%)',
        darkBorder: '#6F1D20',
      };
    case 'good':
      return {
        border: '#C8E6C9',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        title: '#16A34A',
        badgeBg: '#DCFCE7',
        badgeBorder: '#86EFAC',
        dot: '#16A34A',
        darkBg: 'linear-gradient(135deg, #0F2516 0%, #0A1C10 100%)',
        darkBorder: '#1B4D29',
      };
    case 'purify':
    default:
      return {
        border: '#FFE082',
        background: 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)',
        title: '#CA8A04',
        badgeBg: '#FEF08A',
        badgeBorder: '#FDE047',
        dot: '#D97706',
        darkBg: 'linear-gradient(135deg, #2D250F 0%, #1F190A 100%)',
        darkBorder: '#5E4A14',
      };
  }
};

const TimelineDot = styled.div<{ $type: CardType }>`
  position: absolute;
  left: -22.5px;
  top: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 3.5px solid ${({ $type }) => getCardStyle($type).dot};
  z-index: 2;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.8);

  [data-theme='dark'] & {
    background: #1A162B;
    box-shadow: 0 0 0 3px #1A162B;
  }
`;

const GuideCard = styled.div<{ $type: CardType }>`
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: 0 4px 14px rgba(123, 110, 232, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid ${({ $type }) => getCardStyle($type).border};
  background: ${({ $type }) => getCardStyle($type).background};

  [data-theme='dark'] & {
    background: ${({ $type }) => getCardStyle($type).darkBg};
    border-color: ${({ $type }) => getCardStyle($type).darkBorder};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(123, 110, 232, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TimeBadge = styled.div<{ $type: CardType }>`
  font-size: 12px;
  font-weight: 800;
  color: ${({ $type }) => getCardStyle($type).title};
  background: ${({ $type }) => getCardStyle($type).badgeBg};
  border: 1px solid ${({ $type }) => getCardStyle($type).badgeBorder};
  padding: 3px 9px;
  border-radius: 8px;
  font-family: monospace, system-ui;
  letter-spacing: -0.2px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatusTag = styled.div<{ $type: CardType }>`
  font-size: 12px;
  font-weight: 800;
  color: ${({ $type }) => getCardStyle($type).title};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GuideTitle = styled.div<{ $type: CardType }>`
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: #1A162B;
  margin-bottom: 4px;

  [data-theme='dark'] & {
    color: var(--text-primary);
  }
`;

const Description = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-weight: 500;
`;
