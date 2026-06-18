import { useEffect } from 'react';
import styled from 'styled-components';
import { Bell } from 'lucide-react';
import { useAppContext } from '../store/appContext';
import { useAirData } from '../hooks/useAirData';
import AppHeader from '../components/layout/AppHeader';
import AlertList from '../components/alerts/AlertList';

export default function AlertsPage() {
  const { appState } = useAppContext();
  const { fetchAlarms } = useAirData();
  const unreadCount = appState.alarms.filter(a => a.clearYn === 'N').length;

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const triggerPushTest = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }

    if (perm === 'granted') {
      new Notification('🚨 에어플랜 공기질 경보 알림', {
        body: '현재 서울시 미세먼지 수치가 "나쁨" 단계에 진입했습니다. 야외 일정을 조정하시고 마스크를 착용해 주세요.',
      });
    } else {
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
    }
  };

  const unreadBadge = (
    <UnreadBadge id="alert-unread-badge" $active={unreadCount > 0}>
      {unreadCount > 0 ? `${unreadCount}건 발령 중` : '이상 없음 ✓'}
    </UnreadBadge>
  );

  return (
    <View id="view-alerts">
      <AppHeader
        title="알림"
        subTitle="공기질 경보 및 예방 안내"
        rightSlot={unreadBadge}
      />
      
      <PushTestBar>
        <PushInfoText>
          <Bell size={13} color="#7B6EE8" style={{ marginRight: 6 }} /> 실제 기기 알림을 테스트해 보세요.
        </PushInfoText>
        <PushTestBtn onClick={triggerPushTest}>테스트 발송</PushTestBtn>
      </PushTestBar>

      <AlertList alarms={appState.alarms} />
    </View>
  );
}

const View = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 12px);
`;

const PushTestBar = styled.div`
  margin: 0 16px 16px;
  background: rgba(139, 126, 248, 0.08);
  border: 1.5px dashed #B8AAFF;
  border-radius: 18px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PushInfoText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #7B6EE8;
  display: flex;
  align-items: center;
`;

const PushTestBtn = styled.button`
  background: linear-gradient(135deg, #B8AAFF 0%, #8B7EF8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(139, 126, 248, 0.2);
  transition: all 0.2s;
  font-family: inherit;

  &:active {
    transform: scale(0.95);
  }
`;

const UnreadBadge = styled.span<{ $active: boolean }>`
  background: ${({ $active }) => $active ? '#FFE0EC' : '#D9F5E4'};
  color: ${({ $active }) => $active ? '#D64D7A' : '#3DA06A'};
  font-size: 12px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 100px;
`;
