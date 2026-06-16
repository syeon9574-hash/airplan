import styled from 'styled-components';

const LEGEND = [
  { color: '#6BCB8B', label: '좋음 (0-15)' },
  { color: '#F5B944', label: '보통 (16-35)' },
  { color: '#FF8C7A', label: '나쁨 (36-75)' },
  { color: '#FF7FAB', label: '매우나쁨 (76+)' },
];

export default function GradeLegend() {
  return (
    <LegendCard>
      {LEGEND.map(item => (
        <LegendItem key={item.label}>
          <Dot style={{ background: item.color }} />
          {item.label}
        </LegendItem>
      ))}
    </LegendCard>
  );
}

const LegendCard = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 14px 18px;
  margin: 0 16px 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.span`
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0,0,0,0.14);
`;
