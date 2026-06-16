import styled from 'styled-components';
import { Bell, Clock, Sunrise } from 'lucide-react';
import type { Settings } from '../../types';

interface NotificationSettingsProps {
  settings: Settings;
  onSave: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function NotificationSettings({ settings, onSave }: NotificationSettingsProps) {
  return (
    <Section>
      <SectionLabel>알림 설정</SectionLabel>
      <SettingsGroup>
        <SettingsRow>
          <RowIcon style={{ background: '#EDE9FF' }}>
            <Bell size={18} color="#7B6EE8" />
          </RowIcon>
          <RowText>
            <RowTitle>공기질 경보 알림</RowTitle>
            <RowSub>나쁨 이상일 때 알려드려요</RowSub>
          </RowText>
          <ToggleSwitch htmlFor="toggle-alert">
            <input
              type="checkbox"
              id="toggle-alert"
              checked={settings.alertOn}
              onChange={e => onSave('alertOn', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingsRow>
        <SettingsRow>
          <RowIcon style={{ background: '#FFF0E8' }}>
            <Clock size={18} color="#FF7B61" />
          </RowIcon>
          <RowText>
            <RowTitle>일정 전 사전 알림</RowTitle>
            <RowSub>외출 1시간 전 공기질 안내</RowSub>
          </RowText>
          <ToggleSwitch htmlFor="toggle-schedule-alert">
            <input
              type="checkbox"
              id="toggle-schedule-alert"
              checked={settings.scheduleAlertOn}
              onChange={e => onSave('scheduleAlertOn', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingsRow>
        <SettingsRow $last>
          <RowIcon style={{ background: '#FFF5D9' }}>
            <Sunrise size={18} color="#F5A623" />
          </RowIcon>
          <RowText>
            <RowTitle>아침 일기예보 알림</RowTitle>
            <RowSub>매일 오전 7시 오늘의 공기질</RowSub>
          </RowText>
          <ToggleSwitch htmlFor="toggle-morning">
            <input
              type="checkbox"
              id="toggle-morning"
              checked={settings.morningAlertOn}
              onChange={e => onSave('morningAlertOn', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingsRow>
      </SettingsGroup>
    </Section>
  );
}

const Section = styled.div`
  padding: 0 16px;
  margin-bottom: 14px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 9px;
  padding: 0 4px;
`;

const SettingsGroup = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const SettingsRow = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 18px;
  gap: 14px;
  border-bottom: ${({ $last }) => $last ? 'none' : '1px solid rgba(213, 204, 245, 0.25)'};
`;

const RowIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const RowText = styled.div`
  flex: 1;
`;

const RowTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.1px;
`;

const RowSub = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  font-weight: 500;
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
  cursor: pointer;

  input { opacity: 0; width: 0; height: 0; position: absolute; }
  input:checked + span { background: linear-gradient(135deg, #B8AAFF, #8B7EF8); }
  input:checked + span::before { transform: translateX(20px); }
`;

const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background: #DDD5F5;
  border-radius: 100px;
  transition: background 0.3s;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: 3px;
    left: 3px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
    box-shadow: 0 2px 6px rgba(100, 80, 200, 0.2);
  }
`;
