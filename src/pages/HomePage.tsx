import { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../store/appContext';
import { useAirData } from '../hooks/useAirData';
import GreetingBar from '../components/home/GreetingBar';
import AqiCard from '../components/home/AqiCard';
import PmDetailRow from '../components/home/PmDetailRow';
import ActionList from '../components/home/ActionList';
import ForecastChart from '../components/home/ForecastChart';
import SmartTimelineGuide from '../components/home/SmartTimelineGuide';
import SchedulePreview from '../components/home/SchedulePreview';
import WeeklyInsight from '../components/home/WeeklyInsight';


export default function HomePage() {
  const { appState, schedules, settings } = useAppContext();
  const { fetchAll } = useAirData();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      />
      <PmDetailRow pm25={appState.pm25} pm10={appState.pm10} />
      <ActionList pm25={appState.pm25} sensitivity={settings.sensitivity} />
      <ForecastChart />
      <SmartTimelineGuide />
      <WeeklyInsight />
      <SchedulePreview schedules={schedules} sensitivity={settings.sensitivity} />
    </View>
  );
}

const View = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(var(--nav-h) + 12px);
`;
