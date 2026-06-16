import styled from 'styled-components';
import { Lightbulb, Clock, Wind, ShieldAlert, Cpu, Ban } from 'lucide-react';
import { getPersonalizedRecommendations } from '../../utils/airQuality';

interface ActionListProps {
  pm25: number;
  sensitivity: string;
}

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  green:  { bg: 'rgba(61, 160, 106, 0.12)', color: '#3DA06A' },
  yellow: { bg: 'rgba(200, 134, 10, 0.12)', color: '#C8860A' },
  orange: { bg: 'rgba(217, 91, 69, 0.12)', color: '#D95B45' },
  red:    { bg: 'rgba(214, 77, 122, 0.12)', color: '#D64D7A' },
  blue:   { bg: 'rgba(123, 110, 232, 0.12)', color: '#7B6EE8' },
};

function getActionIcon(icon: string, color: string) {
  switch (icon) {
    case '🕐': return <Clock size={20} color={color} />;
    case '💨': return <Wind size={20} color={color} />;
    case '😷': return <ShieldAlert size={20} color={color} />;
    case '🔌': return <Cpu size={20} color={color} />;
    case '🚫': return <Ban size={20} color={color} />;
    default: return <Lightbulb size={20} color={color} />;
  }
}

export default function ActionList({ pm25, sensitivity }: ActionListProps) {
  const recs = getPersonalizedRecommendations(pm25, sensitivity);

  return (
    <>
      <SectionTitle>
        <Lightbulb size={18} color="#7B6EE8" style={{ marginRight: 6 }} /> 오늘의 행동 추천
      </SectionTitle>
      <List id="action-list">
        {recs.map((rec, i) => {
          const style = ICON_COLORS[rec.iconClass] ?? ICON_COLORS.blue;
          return (
            <ActionItem key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <ActionIcon style={{ background: style.bg }}>
                {getActionIcon(rec.icon, style.color)}
              </ActionIcon>
              <ActionText>
                <ActionTitle>{rec.title}</ActionTitle>
                <ActionSub>{rec.sub}</ActionSub>
              </ActionText>
            </ActionItem>
          );
        })}
      </List>
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0 16px;
  margin-bottom: 16px;
`;

const ActionItem = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.4s ease both;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(123, 100, 220, 0.08);
  }
`;

const ActionIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  flex-shrink: 0;
`;

const ActionText = styled.div``;

const ActionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.1px;
`;

const ActionSub = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
  line-height: 1.4;
  font-weight: 500;
`;
