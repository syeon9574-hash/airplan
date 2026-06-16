import { useEffect } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { AppProvider, useAppContext } from './store/appContext';
import { useAirData } from './hooks/useAirData';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import SchedulePage from './pages/SchedulePage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

import { useAlarmScheduler } from './hooks/useAlarmScheduler';

function AppInner() {
  const { currentView, setCurrentView, settings } = useAppContext();
  const { startAutoRefresh } = useAirData();
  const isDark = settings.theme === 'dark';

  // 백그라운드 실시간 알림 스케줄러 구동
  useAlarmScheduler();

  useEffect(() => {
    const cleanup = startAutoRefresh();
    return cleanup;
  }, [startAutoRefresh]);

  return (
    <AppWrapper id="app" $dark={isDark}>
      {currentView === 'home'     && <HomePage />}
      {currentView === 'map'      && <MapPage />}
      {currentView === 'schedule' && <SchedulePage />}
      {currentView === 'alerts'   && <AlertsPage />}
      {currentView === 'settings' && <SettingsPage />}
      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </AppWrapper>
  );
}

export default function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      <AppInner />
    </AppProvider>
  );
}

const AppWrapper = styled.div<{ $dark: boolean }>`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  position: relative;
  background: ${({ $dark }) =>
    $dark
      ? 'linear-gradient(175deg, #0F0D1C 0%, #151126 50%, #1A172F 100%)'
      : 'linear-gradient(175deg, #EDE9FF 0%, #F2EEFF 45%, #E8F0FF 100%)'
  };
  overflow: hidden;
  transition: background 0.4s ease;
`;
