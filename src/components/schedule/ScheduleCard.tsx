import styled from 'styled-components';
import { Clock, Trash2, Footprints, Dumbbell, Car, Wind, HelpCircle } from 'lucide-react';
import { useAppContext } from '../../store/appContext';
import type { Schedule } from '../../types';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';
import { getPersonalizedGrade, getPersonalizedGradeBadgeStyle, getForecastPm25 } from '../../utils/airQuality';

interface ScheduleCardProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onClick: () => void;
}

function getActivityIcon(key: string) {
  const size = 20;
  const color = '#7B6EE8';
  switch (key) {
    case 'walk':     return <Footprints size={size} color="#2E7D32" />;
    case 'exercise': return <Dumbbell size={size} color="#EF6C00" />;
    case 'outing':   return <Car size={size} color="#1565C0" />;
    case 'vent':     return <Wind size={size} color="#6A1B9A" />;
    default:         return <HelpCircle size={size} color={color} />;
  }
}

export default function ScheduleCard({ schedule, onDelete, onClick }: ScheduleCardProps) {
  const { settings } = useAppContext();
  const type = ACTIVITY_TYPES.find(t => t.key === schedule.type) || ACTIVITY_TYPES[0];
  const schedPm25 = getForecastPm25(schedule.startTime);
  const grade = getPersonalizedGrade(schedPm25, settings.sensitivity);
  const badge = getPersonalizedGradeBadgeStyle(schedPm25, settings.sensitivity);

  return (
    <Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <GradeBar style={{ background: grade.color }} />
      <TypeIcon style={{ background: type.bg }}>
        {getActivityIcon(schedule.type)}
      </TypeIcon>
      <Info>
        <Name>{schedule.name || type.label}</Name>
        <Time>
          <Clock size={12} style={{ marginRight: 4 }} /> {schedule.startTime} ~ {schedule.endTime}
        </Time>
      </Info>
      <BadgeWrap>
        <Badge style={{ background: badge.bg, color: badge.color }}>{grade.label}</Badge>
        <AqiMini style={{ color: grade.color }}>{schedPm25}<span>μg</span></AqiMini>
      </BadgeWrap>
      <DelBtn onClick={(e) => { e.stopPropagation(); onDelete(schedule.id); }} aria-label="일정 삭제">
        <Trash2 size={16} />
      </DelBtn>
    </Card>
  );
}

const Card = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.35s ease both;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
`;

const GradeBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 20px 0 0 20px;
  opacity: 0.75;
`;

const TypeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.1px;
`;

const Time = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const BadgeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 100px;
`;

const AqiMini = styled.div`
  font-size: 11px;
  font-weight: 800;
  span {
    font-size: 9px;
    font-weight: 600;
    opacity: 0.75;
    margin-left: 1px;
  }
`;

const DelBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.35;
  padding: 8px;
  border-radius: 10px;
  transition: opacity 0.2s, background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);

  &:hover {
    opacity: 0.85;
    background: #FFE0EC;
    color: #D64D7A;
  }
`;

