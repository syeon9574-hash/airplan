import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../store/appContext';
import { getPersonalizedGrade } from '../utils/airQuality';

export function useAlarmScheduler() {
  const { schedules, settings, appState } = useAppContext();
  const [sentAlarms, setSentAlarms] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 일정 사전 알림이 꺼져 있거나 브라우저 Notification이 지원되지 않는 경우 기동 방지
    if (!settings.scheduleAlertOn || !('Notification' in window)) {
      return;
    }

    const checkAndTriggerAlarms = () => {
      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHour}:${currentMin}`; // 예: "11:06"

      schedules.forEach(schedule => {
        // 이미 발송 완료된 스케줄 ID + 시각 키는 통과
        const alarmKey = `${schedule.id}_${currentTimeString}`;
        if (sentAlarms[alarmKey]) return;

        // 시작 시각과 현재 시각이 분 단위로 일치할 때
        if (schedule.startTime === currentTimeString) {
          if (Notification.permission === 'granted') {
            const grade = getPersonalizedGrade(appState.pm25, settings.sensitivity);
            
            new Notification(`📅 일정 시작 안내 — ${schedule.name}`, {
              body: `지금 시작할 시간이에요! 현재 미세먼지 상태: ${grade.label}(${appState.pm25} μg/m³)`,
              tag: `schedule_${schedule.id}`,
            });

            // 발송 기록 플래그 세팅
            setSentAlarms(prev => ({ ...prev, [alarmKey]: true }));
          }
        }
      });
    };

    // 마운트 시 즉시 검사 후 10초 주기로 지속 관찰
    checkAndTriggerAlarms();
    const interval = window.setInterval(checkAndTriggerAlarms, 10000);
    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [schedules, settings.scheduleAlertOn, settings.sensitivity, appState.pm25, sentAlarms]);
}
