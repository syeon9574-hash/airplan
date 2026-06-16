import styled, { keyframes } from 'styled-components';
import { Calendar, Footprints, Dumbbell, Wind, Car } from 'lucide-react';
import type { Schedule } from '../../types';
import ScheduleCard from './ScheduleCard';

interface ScheduleListProps {
  schedules: Schedule[];
  onDelete: (id: number) => void;
  onClickCard: (schedule: Schedule) => void;
}

export default function ScheduleList({ schedules, onDelete, onClickCard }: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <ListWrap id="schedule-list">
        <EmptyState>
          <EmptyBubble>
            <Calendar size={32} color="#7B6EE8" strokeWidth={1.8} />
          </EmptyBubble>
          <EmptyTitle>등록된 일정이 없어요</EmptyTitle>
          <EmptySub>위 버튼을 눌러 외출·운동·환기 일정을 추가해 보세요!</EmptySub>
          <EmptyHintRow>
            <HintChip>
              <Footprints size={12} style={{ marginRight: 4 }} /> 산책
            </HintChip>
            <HintChip>
              <Dumbbell size={12} style={{ marginRight: 4 }} /> 운동
            </HintChip>
            <HintChip>
              <Wind size={12} style={{ marginRight: 4 }} /> 환기
            </HintChip>
            <HintChip>
              <Car size={12} style={{ marginRight: 4 }} /> 외출
            </HintChip>
          </EmptyHintRow>
        </EmptyState>
      </ListWrap>
    );
  }

  return (
    <ListWrap id="schedule-list">
      {schedules.map((s, i) => (
        <div key={s.id} style={{ animationDelay: `${i * 0.05}s` }}>
          <ScheduleCard schedule={s} onDelete={onDelete} onClick={() => onClickCard(s)} />
        </div>
      ))}
    </ListWrap>
  );
}

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 32px;
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 24px;
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-sm);
`;

const EmptyBubble = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: rgba(139, 126, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 16px;
  animation: ${floatAnim} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin-bottom: 8px;
`;

const EmptySub = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 18px;
`;

const EmptyHintRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const HintChip = styled.span`
  background: rgba(139, 126, 248, 0.1);
  color: #7B6EE8;
  border: 1px solid rgba(139, 126, 248, 0.2);
  border-radius: 100px;
  padding: 5px 13px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`;

