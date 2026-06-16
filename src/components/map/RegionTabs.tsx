import styled from 'styled-components';
import { REGION_TABS } from '../../constants/regionData';

interface RegionTabsProps {
  activeRegion: string;
  onSelect: (region: string) => void;
}

export default function RegionTabs({ activeRegion, onSelect }: RegionTabsProps) {
  return (
    <TabsWrap role="tablist">
      {REGION_TABS.map(region => (
        <Tab
          key={region}
          $active={activeRegion === region}
          role="tab"
          id={`tab-${region}`}
          onClick={() => onSelect(region)}
        >
          {region}
        </Tab>
      ))}
    </TabsWrap>
  );
}

const TabsWrap = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px 14px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 9px 18px;
  border-radius: 100px;
  border: 1.5px solid ${({ $active }) => $active ? 'transparent' : '#DDD5F5'};
  background: ${({ $active }) => $active
    ? 'linear-gradient(135deg, #B8AAFF, #8B7EF8)'
    : 'rgba(255, 255, 255, 0.80)'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => $active ? 'white' : 'var(--text-secondary)'};
  transition: all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
  box-shadow: ${({ $active }) => $active ? '0 4px 14px rgba(139, 126, 248, 0.35)' : 'none'};

  &:active { transform: scale(0.95); }
`;
