import { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Sun, Moon, Info, Database, Navigation } from 'lucide-react';
import { useAppContext } from '../store/appContext';
import AppHeader from '../components/layout/AppHeader';
import NotificationSettings from '../components/settings/NotificationSettings';
import SensitivitySettings from '../components/settings/SensitivitySettings';
import LocationSelectModal from '../components/settings/LocationSelectModal';
import { findClosestLocation } from '../utils/airQuality';

export default function SettingsPage() {
  const { settings, saveSetting } = useAppContext();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <View id="view-settings">
      <AppHeader title="설정" subTitle="에어플랜 환경 설정" />

      {/* 프로필 카드 */}
      <ProfileCard>
        <ProfileAvatar>
          <MapPin size={26} color="white" />
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileTitle>내 위치</ProfileTitle>
          <ProfileLocation id="setting-location">
            {settings.location}
            {settings.useGps && <GpsBadge>📍 GPS</GpsBadge>}
          </ProfileLocation>
        </ProfileInfo>
        <ChangeBtn onClick={() => setIsLocationModalOpen(true)}>
          변경
        </ChangeBtn>
      </ProfileCard>

      <NotificationSettings settings={settings} onSave={saveSetting} />

      {/* 위치 설정 */}
      <LocationSection>
        <SectionLabel>위치 설정</SectionLabel>
        <LocationGroup>
          <LocationRow>
            <RowIcon style={{ background: settings.useGps ? 'rgba(123, 110, 232, 0.12)' : '#EDE9FF' }}>
              <Navigation size={18} color="#7B6EE8" />
            </RowIcon>
            <RowText>
              <RowTitle>GPS 위치 자동 업데이트</RowTitle>
              <RowSub>접속 시 현재 위치로 자동 변경합니다</RowSub>
            </RowText>
            <SwitchWrap>
              <input 
                type="checkbox" 
                id="toggle-gps-mode" 
                aria-label="GPS 자동 업데이트 토글"
                checked={settings.useGps} 
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          const closest = findClosestLocation(latitude, longitude);
                          saveSetting('location', closest);
                          saveSetting('useGps', true);
                        },
                        (error) => {
                          console.warn(error);
                          alert('GPS 위치 권한이 거부되었거나 위치 정보를 가져올 수 없습니다. 브라우저의 설정에서 위치 권한을 확인해주세요.');
                        }
                      );
                    } else {
                      alert('GPS 기능을 지원하지 않는 브라우저입니다.');
                    }
                  } else {
                    saveSetting('useGps', false);
                  }
                }} 
              />
              <SwitchLabel htmlFor="toggle-gps-mode" />
            </SwitchWrap>
          </LocationRow>
        </LocationGroup>
      </LocationSection>

      {/* 화면 테마 */}
      <ThemeSection>
        <SectionLabel>화면 테마</SectionLabel>
        <ThemeGroup>
          <ThemeRow>
            <RowIcon style={{ background: settings.theme === 'dark' ? '#302A54' : '#EDE9FF' }}>
              {settings.theme === 'dark' ? (
                <Moon size={18} color="#B8AAFF" />
              ) : (
                <Sun size={18} color="#7B6EE8" />
              )}
            </RowIcon>
            <RowText>
              <RowTitle>다크 모드</RowTitle>
              <RowSub>어두운 환경에서 눈을 보호합니다</RowSub>
            </RowText>
            <SwitchWrap>
              <input 
                type="checkbox" 
                id="toggle-dark-mode" 
                aria-label="다크 모드 토글"
                checked={settings.theme === 'dark'} 
                onChange={e => saveSetting('theme', e.target.checked ? 'dark' : 'light')} 
              />
              <SwitchLabel htmlFor="toggle-dark-mode" />
            </SwitchWrap>
          </ThemeRow>
        </ThemeGroup>
      </ThemeSection>

      <SensitivitySettings sensitivity={settings.sensitivity} onSave={saveSetting} />

      {/* 앱 정보 */}
      <InfoSection>
        <SectionLabel>앱 정보</SectionLabel>
        <InfoGroup>
          <InfoRow>
            <RowIcon style={{ background: '#EDE9FF' }}>
              <Info size={18} color="#7B6EE8" />
            </RowIcon>
            <RowText><RowTitle>버전 정보</RowTitle></RowText>
            <RowRight>v1.0.0 Draft</RowRight>
          </InfoRow>
          <InfoRow $last>
            <RowIcon style={{ background: '#E8F5FF' }}>
              <Database size={18} color="#2A85FF" />
            </RowIcon>
            <RowText><RowTitle>데이터 출처</RowTitle></RowText>
            <RowRight>에어코리아</RowRight>
          </InfoRow>
        </InfoGroup>
      </InfoSection>

      <LocationSelectModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={(val, useGps = false) => {
          saveSetting('location', val);
          saveSetting('useGps', useGps);
        }}
        currentLocation={settings.location}
      />
    </View>
  );
}

const View = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(var(--nav-h) + 12px);
`;

const ProfileCard = styled.div`
  margin: 0 16px 20px;
  background: linear-gradient(135deg, #C4B8FF 0%, #9880F5 60%, #7B68EE 100%);
  border-radius: 24px;
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
  box-shadow: 0 12px 32px rgba(123, 104, 238, 0.32);
`;

const ProfileAvatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileTitle = styled.div`
  font-size: 13px;
  opacity: 0.85;
  font-weight: 600;
  margin-bottom: 2px;
`;

const ProfileLocation = styled.div`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const ChangeBtn = styled.button`
  margin-left: auto;
  background: rgba(255, 255, 255, 0.28);
  border: 1.5px solid rgba(255, 255, 255, 0.40);
  color: white;
  border-radius: 12px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.38); }
`;

const InfoSection = styled.div`
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

const InfoGroup = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const InfoRow = styled.div<{ $last?: boolean }>`
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
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 3px;
  font-weight: 500;
`;

const RowRight = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #8B7EF8;
`;

const ThemeSection = styled.div`
  padding: 0 16px;
  margin-bottom: 14px;
`;

const ThemeGroup = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const ThemeRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 18px;
  gap: 14px;
`;

const SwitchWrap = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const SwitchLabel = styled.label`
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #DDD5F5;
  transition: .3s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  }

  input:checked + & {
    background-color: #8B7EF8;
  }

  input:checked + &::before {
    transform: translateX(22px);
  }
`;

const GpsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.40);
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 8px;
  vertical-align: middle;
`;

const LocationSection = styled.div`
  padding: 0 16px;
  margin-bottom: 14px;
`;

const LocationGroup = styled.div`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 18px;
  gap: 14px;
`;
