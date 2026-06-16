import styled from 'styled-components';
import { 
  CalendarDays, 
  Calendar, 
  Footprints, 
  Dumbbell, 
  Car, 
  Wind, 
  HelpCircle 
} from 'lucide-react';
import type { Schedule } from '../../types';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';
import { getPersonalizedGrade, getPersonalizedGradeBadgeStyle, getForecastPm25 } from '../../utils/airQuality';

interface SchedulePreviewProps {
  schedules: Schedule[];
  sensitivity: string;
}

function getActivityIcon(key: string) {
  const size = 22;
  const color = '#6454AC';
  switch (key) {
    case 'walk':     return <Footprints size={size} color="#4CAF50" />;
    case 'exercise': return <Dumbbell size={size} color="#FF9800" />;
    case 'outing':   return <Car size={size} color="#2196F3" />;
    case 'vent':     return <Wind size={size} color="#9C27B0" />;
    default:         return <HelpCircle size={size} color={color} />;
  }
}

export default function SchedulePreview({ schedules, sensitivity }: SchedulePreviewProps) {
  const todaySchedules = schedules.filter(s => (s.day || 'today') === 'today');
  const preview = todaySchedules.slice(0, 2);

  return (
    <>
      <SectionTitle>
        <CalendarDays size={16} color="#7B6EE8" style={{ marginRight: 6 }} /> 오늘의 일정 미리보기
      </SectionTitle>
      <PreviewCard id="home-schedule-preview">
        {preview.length === 0 ? (
          <EmptyMsg>
            <EmptyIconWrap>
              <Calendar size={28} color="#DDD5F5" />
            </EmptyIconWrap>
            <div>등록된 일정이 없어요</div>
            <EmptySub>일정을 추가해 보세요!</EmptySub>
          </EmptyMsg>
        ) : (
          preview.map(s => {
            const type = ACTIVITY_TYPES.find(t => t.key === s.type) || ACTIVITY_TYPES[0];
            const schedPm25 = getForecastPm25(s.startTime);
            const grade = getPersonalizedGrade(schedPm25, sensitivity);
            const badge = getPersonalizedGradeBadgeStyle(schedPm25, sensitivity);
            return (
              <ScheduleRow key={s.id}>
                <TypeIcon style={{ background: type.bg }}>
                  {getActivityIcon(s.type)}
                </TypeIcon>
                <Info>
                  <Name>{s.name || type.label}</Name>
                  <Time>{s.startTime} ~ {s.endTime}</Time>
                </Info>
                <Badge style={{ background: badge.bg, color: badge.color }}>{grade.label}</Badge>
              </ScheduleRow>
            );
          })
        )}
      </PreviewCard>
    </>
  );
}

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 4px 20px 12px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
`;

const PreviewCard = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  margin: 0 16px 16px;
`;

const EmptyMsg = styled.div`
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 14px 0 10px;
  font-weight: 600;
`;

const EmptyIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const EmptySub = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  font-weight: 500;
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(213, 204, 245, 0.25);
    margin-bottom: 2px;
  }
`;

const TypeIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
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
  margin-top: 2px;
  font-weight: 500;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 100px;
`;
