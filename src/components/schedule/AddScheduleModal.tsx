import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Footprints, 
  Dumbbell, 
  Car, 
  Wind, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import { useAppContext } from '../../store/appContext';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';
import { FORECAST_DUMMY } from '../../constants/regionData';
import { getPersonalizedGrade, getPersonalizedGradeBadgeStyle } from '../../utils/airQuality';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, startTime: string, endTime: string) => void;
}

function getActivityIcon(key: string, isSelected: boolean) {
  const size = 22;
  const color = isSelected ? '#7B6EE8' : '#6454AC';
  switch (key) {
    case 'walk':     return <Footprints size={size} color={isSelected ? '#2E7D32' : '#4CAF50'} />;
    case 'exercise': return <Dumbbell size={size} color={isSelected ? '#EF6C00' : '#FF9800'} />;
    case 'outing':   return <Car size={size} color={isSelected ? '#1565C0' : '#2196F3'} />;
    case 'vent':     return <Wind size={size} color={isSelected ? '#6A1B9A' : '#9C27B0'} />;
    default:         return <HelpCircle size={size} color={color} />;
  }
}

export default function AddScheduleModal({ isOpen, onClose, onSave }: AddScheduleModalProps) {
  const { settings } = useAppContext();
  const [selectedType, setSelectedType] = useState('walk');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleSave = () => {
    onSave(selectedType, startTime, endTime);
    onClose();
  };

  const handleTestAlarmSetup = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    const targetHour = String(now.getHours()).padStart(2, '0');
    const targetMin = String(now.getMinutes()).padStart(2, '0');
    const targetTime = `${targetHour}:${targetMin}`;

    const endNow = new Date(now.getTime());
    endNow.setHours(endNow.getHours() + 1);
    const endHour = String(endNow.getHours()).padStart(2, '0');
    const endMin = String(endNow.getMinutes()).padStart(2, '0');
    const endTimeStr = `${endHour}:${endMin}`;

    onSave('walk', targetTime, endTimeStr);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const forecast = (() => {
    const hour = parseInt(startTime.split(':')[0], 10);
    let closestItem = FORECAST_DUMMY[0];
    let minDiff = 24;

    for (const item of FORECAST_DUMMY) {
      const itemHour = parseInt(item.time.replace('시', ''), 10);
      if (isNaN(itemHour)) continue;
      let diff = Math.abs(hour - itemHour);
      if (diff > 12) diff = 24 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestItem = item;
      }
    }

    const itemHour = parseInt(closestItem.time.replace('시', ''), 10);
    let timeLabel = '';
    if (itemHour === 0 || itemHour === 24) timeLabel = '오전 12시';
    else if (itemHour === 12) timeLabel = '오후 12시';
    else if (itemHour < 12) timeLabel = `오전 ${itemHour}시`;
    else timeLabel = `오후 ${itemHour - 12}시`;

    const grade = getPersonalizedGrade(closestItem.pm25, settings.sensitivity);
    const badge = getPersonalizedGradeBadgeStyle(closestItem.pm25, settings.sensitivity);
    return { label: timeLabel, pm25: closestItem.pm25, grade, badge };
  })();

  const renderForecastIcon = () => {
    const size = 22;
    if (forecast.grade.key === 'good') {
      return <Sparkles size={size} color={forecast.grade.color} />;
    }
    if (forecast.grade.key === 'moderate') {
      return <AlertTriangle size={size} color={forecast.grade.color} />;
    }
    return <ShieldAlert size={size} color={forecast.grade.color} />;
  };

  return (
    <Overlay
      id="schedule-modal"
      $open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="일정 추가"
      onClick={handleOverlayClick}
    >
      <Sheet $open={isOpen}>
        <Handle />
        <ModalTitle>새 일정 추가</ModalTitle>

        <SubLabel>활동 유형 선택</SubLabel>
        <TypeGrid>
          {ACTIVITY_TYPES.map(t => (
            <TypeBtn
              key={t.key}
              $selected={selectedType === t.key}
              id={`type-${t.key}`}
              aria-label={t.label}
              onClick={() => setSelectedType(t.key)}
            >
              <TypeBtnIcon $selected={selectedType === t.key} style={{ background: selectedType === t.key ? 'rgba(139,126,248,0.15)' : t.bg }}>
                {getActivityIcon(t.key, selectedType === t.key)}
              </TypeBtnIcon>
              {t.label}
            </TypeBtn>
          ))}
        </TypeGrid>

        <SubLabel>시간 설정</SubLabel>
        <TimeGrid>
          <TimeInputWrap>
            <label htmlFor="start-time">시작 시간</label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </TimeInputWrap>
          <TimeInputWrap>
            <label htmlFor="end-time">종료 시간</label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </TimeInputWrap>
        </TimeGrid>

        <AqiPreview style={{ background: forecast.badge.bg, borderColor: forecast.grade.color }}>
          <PreviewIconWrap>
            {renderForecastIcon()}
          </PreviewIconWrap>
          <PreviewContent>
            <PreviewTitle style={{ color: forecast.grade.color }}>선택 시간대 예측 공기질</PreviewTitle>
            <PreviewSub style={{ color: forecast.grade.color }}>
              <strong>{forecast.label}</strong> 기준: PM2.5 <strong>{forecast.pm25} μg/m³</strong> ({forecast.grade.label})<br />
              {
                forecast.grade.key === 'good' ? '실외 활동을 적극 추천합니다!' :
                forecast.grade.key === 'moderate' ? '활동에 문제없으나 민감군은 마스크를 권장해요.' :
                '실내 활동을 권장하며, 부득이한 외출 시 보건용 마스크를 착용하세요.'
              }
            </PreviewSub>
          </PreviewContent>
        </AqiPreview>

        <TestAlarmBtn id="modal-test-alarm-btn" onClick={handleTestAlarmSetup}>
          <Clock size={14} style={{ marginRight: 6 }} /> 1분 뒤 알림 테스트 일정 추가
        </TestAlarmBtn>

        <SaveBtn id="modal-save-btn" onClick={handleSave}>
          일정 저장하기
        </SaveBtn>
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
  background: rgba(46, 38, 87, 0.30);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: ${({ $open }) => $open ? 1 : 0};
  pointer-events: ${({ $open }) => $open ? 'all' : 'none'};
  transition: opacity 0.3s;
`;

const Sheet = styled.div<{ $open: boolean }>`
  background: linear-gradient(180deg, #FDFCFF 0%, #F8F5FF 100%);
  border-radius: 30px 30px 0 0;
  width: 100%;
  max-width: 430px;
  padding: 28px 22px 44px;
  transform: ${({ $open }) => $open ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  animation: ${({ $open }) => $open ? slideUp : 'none'} 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
`;

const Handle = styled.div`
  width: 38px;
  height: 4px;
  background: #DDD5F5;
  border-radius: 100px;
  margin: 0 auto 22px;
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 22px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const SubLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 22px;
`;

const TypeBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 6px;
  border: 2px solid ${({ $selected }) => $selected ? '#8B7EF8' : '#EDE8FB'};
  border-radius: 18px;
  background: ${({ $selected }) => $selected ? 'rgba(139,126,248,0.08)' : 'white'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $selected }) => $selected ? '#7B6EE8' : 'var(--text-secondary)'};
  transition: all 0.2s;
  box-shadow: ${({ $selected }) => $selected ? '0 4px 14px rgba(139,126,248,0.25)' : 'none'};

  &:active { transform: scale(0.94); }
`;

const TypeBtnIcon = styled.span<{ $selected: boolean }>`
  font-size: 26px;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const TimeInputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.2px;
  }

  input {
    border: 1.5px solid #DDD5F5;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    color: var(--text-primary);
    background: white;

    &:focus {
      border-color: #8B7EF8;
      box-shadow: 0 0 0 3px rgba(139, 126, 248, 0.14);
    }
  }
`;

const AqiPreview = styled.div`
  background: linear-gradient(135deg, #FFF9EC, #FFF4D9);
  border: 1.5px solid #FFE4A0;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PreviewIconWrap = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
`;

const PreviewContent = styled.div`
  flex: 1;
`;

const PreviewTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #C8860A;
`;

const PreviewSub = styled.div`
  font-size: 12px;
  color: #A07020;
  margin-top: 3px;
  line-height: 1.4;
`;

const SaveBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #B8AAFF 0%, #8B7EF8 100%);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 17px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(139, 126, 248, 0.40);
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: inherit;
  letter-spacing: -0.2px;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 14px rgba(139, 126, 248, 0.30);
  }
`;

const TestAlarmBtn = styled.button`
  width: 100%;
  background: rgba(139, 126, 248, 0.12);
  color: #8B7EF8;
  border: 1.5px dashed #8B7EF8;
  border-radius: 18px;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
  font-family: inherit;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.97);
    background: rgba(139, 126, 248, 0.20);
  }
`;
