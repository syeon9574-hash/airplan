import { useState } from 'react';
import styled from 'styled-components';
import { Plus, Sparkles, AlertTriangle, ShieldAlert, List } from 'lucide-react';
import { useAppContext } from '../store/appContext';
import AppHeader from '../components/layout/AppHeader';
import ScheduleList from '../components/schedule/ScheduleList';
import AddScheduleModal from '../components/schedule/AddScheduleModal';
import AlternativeActivityModal from '../components/schedule/AlternativeActivityModal';
import { ACTIVITY_TYPES } from '../constants/activityTypes';
import { getPersonalizedGrade, getPersonalizedGradeBadgeStyle, getForecastPm25 } from '../utils/airQuality';
import type { Schedule } from '../types';

export default function SchedulePage() {
  const { schedules, addSchedule, deleteSchedule, appState, isModalOpen, setIsModalOpen, settings } = useAppContext();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isAlternativeOpen, setIsAlternativeOpen] = useState(false);

  const handleSave = (type: string, startTime: string, endTime: string) => {
    const actType = ACTIVITY_TYPES.find(t => t.key === type) || ACTIVITY_TYPES[0];
    addSchedule({ type, name: actType.label, startTime, endTime });
  };

  const grade = getPersonalizedGrade(appState.pm25, settings.sensitivity);
  const badge = getPersonalizedGradeBadgeStyle(appState.pm25, settings.sensitivity);

  const renderBannerIcon = () => {
    const iconSize = 22;
    if (grade.key === 'good') {
      return <Sparkles size={iconSize} color={grade.color} />;
    }
    if (grade.key === 'moderate') {
      return <AlertTriangle size={iconSize} color={grade.color} />;
    }
    return <ShieldAlert size={iconSize} color={grade.color} />;
  };

  return (
    <View id="view-schedule">
      <AppHeader title="일정 관리" subTitle="외출·운동·환기 일정을 등록하세요" />

      <AddBtn id="schedule-add-btn" onClick={() => setIsModalOpen(true)} aria-label="일정 추가하기">
        <Plus size={16} strokeWidth={2.5} /> 새 일정 추가하기
      </AddBtn>

      {/* 공기질 요약 배너 */}
      <AqiBanner style={{ background: badge.bg, borderColor: grade.color, boxShadow: 'none' }}>
        <BannerIconWrap>
          {renderBannerIcon()}
        </BannerIconWrap>
        <BannerContent>
          <BannerTitle style={{ color: grade.color }}>현재 공기질: {grade.label}</BannerTitle>
          <BannerSub style={{ color: grade.color }}>
            초미세먼지 농도: <strong>{appState.pm25} μg/m³</strong>입니다.<br />
            {
              grade.key === 'good' ? '야외 활동을 진행하기에 매우 기분 좋은 날씨입니다.' :
              grade.key === 'moderate' ? '무난한 수준이지만, 민감군 환자는 가급적 주의가 필요합니다.' :
              '공기가 매우 탁합니다. 장시간 야외 활동을 피하고 일정을 조정해보세요.'
            }
          </BannerSub>
        </BannerContent>
      </AqiBanner>

      <SectionTitle>
        <List size={16} color="#7B6EE8" style={{ marginRight: 6 }} /> 등록된 일정
      </SectionTitle>
      <ScheduleList
        schedules={schedules}
        onDelete={deleteSchedule}
        onClickCard={sch => {
          const forecastPm25 = getForecastPm25(sch.startTime);
          const schedGrade = getPersonalizedGrade(forecastPm25, settings.sensitivity);
          if (schedGrade.key === 'bad' || schedGrade.key === 'very-bad') {
            setSelectedSchedule(sch);
            setIsAlternativeOpen(true);
          } else {
            alert(`☀️ 이 시간대(${sch.startTime})는 예측 공기질이 '${schedGrade.label}'입니다. 계획대로 진행하기 좋은 환경이에요!`);
          }
        }}
      />

      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {selectedSchedule && (
        <AlternativeActivityModal
          isOpen={isAlternativeOpen}
          onClose={() => setIsAlternativeOpen(false)}
          activityType={selectedSchedule.type}
        />
      )}
    </View>
  );
}

const View = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(var(--nav-h) + 12px);
`;

const AddBtn = styled.button`
  margin: 0 16px 14px;
  background: linear-gradient(135deg, #C4B8FF 0%, #8B7EF8 100%);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 17px;
  width: calc(100% - 32px);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(139, 126, 248, 0.38);
  transition: transform 0.2s, box-shadow 0.2s;
  letter-spacing: -0.2px;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 14px rgba(139, 126, 248, 0.28);
  }
`;

const AqiBanner = styled.div`
  background: linear-gradient(135deg, #FFF9EC, #FFF4D9);
  border: 1.5px solid #FFE4A0;
  border-radius: 20px;
  margin: 0 16px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  box-shadow: 0 4px 14px rgba(245, 185, 68, 0.14);
`;

const BannerIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #C8860A;
  letter-spacing: -0.2px;
`;

const BannerSub = styled.div`
  font-size: 12px;
  color: #A07020;
  margin-top: 3px;
  font-weight: 500;
  line-height: 1.4;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 4px 20px 12px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.2px;
`;
