import styled from 'styled-components';
import { HeartPulse } from 'lucide-react';
import type { Settings } from '../../types';

interface SensitivitySettingsProps {
  sensitivity: Settings['sensitivity'];
  onSave: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function SensitivitySettings({ sensitivity, onSave }: SensitivitySettingsProps) {
  return (
    <Section>
      <SectionLabel>건강 민감도</SectionLabel>
      <SettingsGroup>
        <SettingsRow>
          <RowIcon>
            <HeartPulse size={18} color="#2A85FF" />
          </RowIcon>
          <RowText>
            <RowTitle>나의 민감도 설정</RowTitle>
            <RowSub>설정에 따라 추천 기준이 달라져요</RowSub>
          </RowText>
        </SettingsRow>
        <SettingsRow $last>
          <select
            id="setting-sensitivity"
            aria-label="민감도 선택"
            value={sensitivity}
            onChange={e => onSave('sensitivity', e.target.value as Settings['sensitivity'])}
          >
            <option value="normal">일반인</option>
            <option value="sensitive">민감군 (천식, 알러지)</option>
            <option value="child">어린이·청소년</option>
            <option value="elderly">노약자·임산부</option>
          </select>
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
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding: 0 4px;
`;

const SettingsGroup = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
`;

const SettingsRow = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 14px;
  border-bottom: ${({ $last }) => $last ? 'none' : '1px solid rgba(0,0,0,0.05)'};
`;

const RowIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #E3F2FD;
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
  font-weight: 600;
`;

const RowSub = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
`;
