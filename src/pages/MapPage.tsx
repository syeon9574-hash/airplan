import { useState } from 'react';
import styled from 'styled-components';
import AppHeader from '../components/layout/AppHeader';
import RegionTabs from '../components/map/RegionTabs';
import GradeLegend from '../components/map/GradeLegend';
import RegionList from '../components/map/RegionList';

export default function MapPage() {
  const [activeRegion, setActiveRegion] = useState('수도권');

  return (
    <View id="view-map">
      <AppHeader title="지역별 현황" subTitle="전국 미세먼지 실시간 정보" />
      <RegionTabs activeRegion={activeRegion} onSelect={setActiveRegion} />
      <GradeLegend />
      <RegionList region={activeRegion} />
    </View>
  );
}

const View = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 12px);
`;
