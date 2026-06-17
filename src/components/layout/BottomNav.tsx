import styled from 'styled-components';
import { Home, Map, CalendarDays, Bell, Settings2 } from 'lucide-react';
import type { ViewType } from '../../types';

interface NavItem {
  id: ViewType;
  Icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     Icon: Home,         label: '홈' },
  { id: 'map',      Icon: Map,          label: '지역' },
  { id: 'schedule', Icon: CalendarDays, label: '일정' },
  { id: 'alerts',   Icon: Bell,         label: '알림' },
  { id: 'settings', Icon: Settings2,    label: '설정' },
];

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <Nav role="navigation" aria-label="주요 메뉴">
      {NAV_ITEMS.map(item => (
        <NavButton
          key={item.id}
          $active={currentView === item.id}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
          id={`nav-${item.id}`}
        >
          <NavIcon $active={currentView === item.id}>
            <item.Icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
          </NavIcon>
          <NavLabel $active={currentView === item.id}>{item.label}</NavLabel>
          <NavDot $active={currentView === item.id} />
        </NavButton>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: calc(var(--nav-h) + env(safe-area-inset-bottom));
  background: var(--surface);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
  box-shadow: 0 -6px 28px rgba(123, 100, 220, 0.08);
`;

const NavButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: ${({ $active }) => $active ? '#7B6EE8' : 'var(--text-muted)'};
  border: none;
  background: ${({ $active }) => $active ? 'rgba(123, 110, 232, 0.10)' : 'none'};
  flex: 1;

  &:active { transform: scale(0.88); }
`;

const NavIcon = styled.span<{ $active: boolean }>`
  font-size: 21px;
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: ${({ $active }) => $active ? 'scale(1.22) translateY(-1px)' : 'scale(1)'};
`;

const NavLabel = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: ${({ $active }) => $active ? '700' : '500'};
  letter-spacing: 0.3px;
  transition: color 0.2s;
  color: ${({ $active }) => $active ? '#7B6EE8' : 'var(--text-muted)'};
`;

const NavDot = styled.div<{ $active: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #A89EF0;
  opacity: ${({ $active }) => $active ? 1 : 0};
  transition: opacity 0.2s, transform 0.2s;
  transform: ${({ $active }) => $active ? 'scale(1)' : 'scale(0)'};
`;
