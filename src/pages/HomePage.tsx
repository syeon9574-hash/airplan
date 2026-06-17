import { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../store/appContext';
import { useAirData } from '../hooks/useAirData';
import GreetingBar from '../components/home/GreetingBar';
import AqiCard from '../components/home/AqiCard';
import PmDetailRow from '../components/home/PmDetailRow';
import ForecastChart from '../components/home/ForecastChart';
import SmartActionGuide from '../components/home/SmartActionGuide';
import SchedulePreview from '../components/home/SchedulePreview';
import WeeklyInsight from '../components/home/WeeklyInsight';
import LocationSelectModal from '../components/settings/LocationSelectModal';

export default function HomePage() {
  const { appState, schedules, settings, saveSetting } = useAppContext();
  const { fetchAll } = useAirData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAll();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <View id="view-home">
      <GreetingBar
        apiStatus={appState.apiStatus}
        apiMessage={appState.apiMessage}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <AqiCard
        pm25={appState.pm25}
        dataTime={appState.dataTime}
        apiOk={appState.apiOk}
        location={settings.location}
        sensitivity={settings.sensitivity}
        onLocationClick={() => setIsLocationModalOpen(true)}
      />
      <PmDetailRow pm25={appState.pm25} pm10={appState.pm10} />
      <ForecastChart />
      <SmartActionGuide />
      <WeeklyInsight />
      <SchedulePreview schedules={schedules} sensitivity={settings.sensitivity} />

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
  padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 12px);
`;
