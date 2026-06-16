import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Lightbulb, 
  Timer, 
  ListChecks, 
  AlertTriangle, 
  Footprints, 
  Dumbbell, 
  Car, 
  Wind, 
  HelpCircle 
} from 'lucide-react';
import { ALTERNATIVE_ACTIVITIES } from '../../constants/alternativeActivities';
import type { AlternativeActivity } from '../../constants/alternativeActivities';

interface AlternativeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: string;
}

function getAlternativeIcon(key: string) {
  const size = 22;
  const color = '#7B6EE8';
  switch (key) {
    case 'walk':     return <Footprints size={size} color={color} />;
    case 'exercise':
    case 'sports':   return <Dumbbell size={size} color={color} />;
    case 'outing':   return <Car size={size} color={color} />;
    case 'vent':
    case 'ventilation': return <Wind size={size} color={color} />;
    default:         return <HelpCircle size={size} color={color} />;
  }
}

export default function AlternativeActivityModal({ isOpen, onClose, activityType }: AlternativeActivityModalProps) {
  const [checkedTips, setCheckedTips] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 10분 타이머 (테스트를 위해 600초 세팅)
  const startTimer = () => {
    setTimerSeconds(600);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      alert("🎉 실내 홈케어 대체 활동 완료! 오늘도 멋지게 건강을 지켰어요. ✨");
      setTimerSeconds(null);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen) return null;

  const dataKey = activityType === 'exercise' ? 'sports' : activityType === 'vent' ? 'ventilation' : activityType;
  const data: AlternativeActivity = ALTERNATIVE_ACTIVITIES[dataKey] || ALTERNATIVE_ACTIVITIES['walk'];

  const toggleCheck = (idx: number) => {
    setCheckedTips(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Overlay $open={isOpen} onClick={onClose}>
      <Sheet $open={isOpen} onClick={e => e.stopPropagation()}>
        <Handle />
        
        <TitleHeader>
          <IconCircle>{getAlternativeIcon(activityType)}</IconCircle>
          <div>
            <Title>
              <Lightbulb size={12} color="#8B7EF8" style={{ marginRight: 4 }} /> 에어플랜 대체 제안
            </Title>
            <SubTitle>{data.title}</SubTitle>
          </div>
        </TitleHeader>

        <DescriptionCard>{data.sub}</DescriptionCard>

        {/* 인터랙티브 타이머 세션 */}
        <TimerSection>
          <TimerTitle>
            <Timer size={14} color="#7B6EE8" style={{ marginRight: 6 }} /> 대체 활동 타이머
          </TimerTitle>
          {timerSeconds === null ? (
            <StartTimerBtn onClick={startTimer}>10분 가이드 타이머 시작</StartTimerBtn>
          ) : (
            <TimerDisplay>
              <TimeVal>{formatTime(timerSeconds)}</TimeVal>
              <StopTimerBtn onClick={() => { setIsTimerRunning(false); setTimerSeconds(null); }}>
                초기화
              </StopTimerBtn>
            </TimerDisplay>
          )}
        </TimerSection>

        {/* 체크리스트 세션 */}
        <SectionTitle>
          <ListChecks size={14} color="#7B6EE8" style={{ marginRight: 6 }} /> 추천 실천 루틴
        </SectionTitle>
        <ListGroup>
          {data.tips.map((tip, idx) => (
            <ListItem key={idx} onClick={() => toggleCheck(idx)}>
              <CheckCircle $checked={checkedTips[idx]}>
                {checkedTips[idx] && '✓'}
              </CheckCircle>
              <TipText $checked={checkedTips[idx]}>{tip}</TipText>
            </ListItem>
          ))}
        </ListGroup>

        {/* 주의사항 세션 */}
        <SectionTitle>
          <AlertTriangle size={14} color="#FF8C7A" style={{ marginRight: 6 }} /> 예방 안전 수칙
        </SectionTitle>
        <PrecautionGroup>
          {data.precautions.map((prec, idx) => (
            <PrecautionRow key={idx}>
              <Dot>•</Dot>
              <div>{prec}</div>
            </PrecautionRow>
          ))}
        </PrecautionGroup>

        <CloseBtn onClick={onClose}>확인했습니다</CloseBtn>
      </Sheet>
    </Overlay>
  );
}

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  transition: opacity 0.3s;
`;

const Sheet = styled.div<{ $open: boolean }>`
  width: 100%;
  max-width: 430px;
  background: var(--surface-solid);
  border-radius: 28px 28px 0 0;
  padding: 24px 20px 32px;
  box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  max-height: 85vh;
  overflow-y: auto;
`;

const Handle = styled.div`
  width: 40px;
  height: 5px;
  background: var(--text-muted);
  border-radius: 3px;
  margin: -10px auto 20px;
  opacity: 0.5;
`;

const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(139, 126, 248, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #8B7EF8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
`;

const SubTitle = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 2px;
`;

const DescriptionCard = styled.div`
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 18px;
  padding: 14px 16px;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
  font-weight: 600;
  margin-bottom: 20px;
`;

const TimerSection = styled.div`
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimerTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
`;

const StartTimerBtn = styled.button`
  background: #8B7EF8;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  &:active { transform: scale(0.98); }
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
`;

const TimeVal = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #8B7EF8;
  font-variant-numeric: tabular-nums;
`;

const StopTimerBtn = styled.button`
  background: rgba(255, 127, 171, 0.15);
  color: #FF7FAB;
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: var(--text-secondary);
  margin-bottom: 8px;
  padding: 0 4px;
  display: flex;
  align-items: center;
`;

const ListGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:active { transform: scale(0.99); }
`;

const CheckCircle = styled.div<{ $checked?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => $checked ? '#8B7EF8' : 'var(--text-muted)'};
  background: ${({ $checked }) => $checked ? '#8B7EF8' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 900;
  transition: all 0.2s;
  flex-shrink: 0;
`;

const TipText = styled.span<{ $checked?: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $checked }) => $checked ? 'var(--text-secondary)' : 'var(--text-primary)'};
  text-decoration: ${({ $checked }) => $checked ? 'line-through' : 'none'};
`;

const PrecautionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 26px;
  padding: 4px 6px;
`;

const PrecautionRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  font-weight: 500;
`;

const Dot = styled.span`
  color: #FF8C7A;
  font-weight: bold;
`;

const CloseBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #B8AAFF 0%, #8B7EF8 100%);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(139, 126, 248, 0.3);
  &:active { transform: scale(0.98); }
`;
