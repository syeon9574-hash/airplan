import type { AqiGrade } from '../types';
import { FORECAST_DUMMY } from '../constants/regionData';

export function getForecastPm25(startTime: string): number {
  if (!startTime) return 28; // fallback
  const hour = parseInt(startTime.split(':')[0], 10);
  if (isNaN(hour)) return 28;

  let closestItem = FORECAST_DUMMY[0];
  let minDiff = 24;

  for (const item of FORECAST_DUMMY) {
    const itemHour = parseInt(item.time.replace('시', ''), 10);
    if (isNaN(itemHour)) continue;
    let diff = Math.abs(hour - itemHour);
    if (diff > 12) diff = 24 - diff;
    if (diff < minDiff) {
      minDiff = diff;
      closestItem = item;
    }
  }

  return closestItem.pm25;
}


// ── 공기질 등급 계산 (기본형) ───────────────────
export function getGrade(pm25: number): AqiGrade {
  if (pm25 <= 15) return { label: '좋음',    key: 'good',     color: '#6BCB8B', cssClass: 'good' };
  if (pm25 <= 35) return { label: '보통',    key: 'moderate', color: '#F5B944', cssClass: 'moderate' };
  if (pm25 <= 75) return { label: '나쁨',    key: 'bad',      color: '#FF8C7A', cssClass: 'bad' };
  return            { label: '매우나쁨', key: 'very-bad', color: '#FF7FAB', cssClass: 'very-bad' };
}

// ── 개인화 맞춤형 공기질 등급 계산 ────────────────
export function getPersonalizedGrade(pm25: number, sensitivity: string = 'normal'): AqiGrade {
  const isNormal = sensitivity === 'normal';
  const thresholdGood = isNormal ? 15 : 12;
  const thresholdMod = isNormal ? 35 : 25;
  const thresholdBad = isNormal ? 75 : 50;

  if (pm25 <= thresholdGood) return { label: '좋음',    key: 'good',     color: '#6BCB8B', cssClass: 'good' };
  if (pm25 <= thresholdMod)  return { label: '보통',    key: 'moderate', color: '#F5B944', cssClass: 'moderate' };
  if (pm25 <= thresholdBad)  return { label: '나쁨',    key: 'bad',      color: '#FF8C7A', cssClass: 'bad' };
  return                          { label: '매우나쁨', key: 'very-bad', color: '#FF7FAB', cssClass: 'very-bad' };
}

export function gradeCss(pm25: number): string {
  return `grade-${getGrade(pm25).cssClass}`;
}

// ── 파스텔 AQI 카드 그라디언트 ──────────────
export function getGradeGradient(cssClass: string): string {
  const map: Record<string, string> = {
    'good':      'linear-gradient(145deg, #A8E6C8 0%, #6BCBA4 100%)',
    'moderate':  'linear-gradient(145deg, #FFD98A 0%, #F5A623 100%)',
    'bad':       'linear-gradient(145deg, #FFB3A5 0%, #FF7B61 100%)',
    'very-bad':  'linear-gradient(145deg, #FFB3CF 0%, #FF6FAA 100%)',
  };
  return map[cssClass] ?? 'linear-gradient(145deg, #B0C4FF 0%, #7B9EFF 100%)';
}

// ── 등급별 배지 색 (기본) ───────────────────────
export function getGradeBadgeStyle(pm25: number): { bg: string; color: string } {
  const grade = getGrade(pm25);
  const map: Record<string, { bg: string; color: string }> = {
    'good':       { bg: '#D9F5E4', color: '#3DA06A' },
    'moderate':   { bg: '#FFF0C8', color: '#C8860A' },
    'bad':        { bg: '#FFE4DF', color: '#D95B45' },
    'very-bad':   { bg: '#FFE0EC', color: '#D64D7A' },
  };
  return map[grade.cssClass] ?? { bg: '#D9F5E4', color: '#3DA06A' };
}

// ── 개인화 등급별 배지 색 ───────────────────────────
export function getPersonalizedGradeBadgeStyle(pm25: number, sensitivity: string = 'normal'): { bg: string; color: string } {
  const grade = getPersonalizedGrade(pm25, sensitivity);
  const map: Record<string, { bg: string; color: string }> = {
    'good':       { bg: '#D9F5E4', color: '#3DA06A' },
    'moderate':   { bg: '#FFF0C8', color: '#C8860A' },
    'bad':        { bg: '#FFE4DF', color: '#D95B45' },
    'very-bad':   { bg: '#FFE0EC', color: '#D64D7A' },
  };
  return map[grade.cssClass] ?? { bg: '#D9F5E4', color: '#3DA06A' };
}

// ── 날짜 / 인사말 ────────────────────────────
export function getDateString(): string {
  const now = new Date();
  const days = '일월화수목금토';
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`;
}

export function getGreetingText(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '오늘 하루도 건강하게';
  return '좋은 저녁이에요';
}

// ── 행동 추천 목록 ───────────────────────────
export interface Recommendation {
  icon: string;
  iconClass: string;
  title: string;
  sub: string;
}

export function getRecommendations(pm25: number): Recommendation[] {
  const rec: Recommendation[] = [
    {
      icon: '🕐',
      iconClass: 'blue',
      title: '오늘의 최적 외출 시간',
      sub:
        pm25 <= 15 ? '종일 쾌적합니다!' :
        pm25 <= 35 ? '오전 6–10시, 저녁 8시 이후 권장' :
        '외출 자제 또는 마스크 필수',
    },
    {
      icon: '💨',
      iconClass: pm25 <= 35 ? 'green' : 'orange',
      title: '실내 환기',
      sub:
        pm25 <= 15 ? '자유롭게 환기 가능' :
        pm25 <= 35 ? '오전 중 10–15분 환기 권장' :
        '환기 자제, 공기청정기 가동',
    },
    {
      icon: '😷',
      iconClass: pm25 <= 15 ? 'green' : pm25 <= 35 ? 'yellow' : 'orange',
      title: '마스크 착용',
      sub:
        pm25 <= 15 ? '마스크 불필요' :
        pm25 <= 35 ? '민감군은 KF80 착용 권장' :
        '외출 시 KF94 마스크 필수',
    },
  ];
  if (pm25 > 35) rec.push({ icon: '🔌', iconClass: 'blue',  title: '공기청정기 가동', sub: '강력 모드로 실내 공기 정화 권장' });
  if (pm25 > 75) rec.push({ icon: '🚫', iconClass: 'red',   title: '야외 운동 금지',  sub: '심혈관·호흡기 질환 위험' });
  return rec;
}

// ── 개인화 맞춤형 행동 추천 목록 ───────────────────────────
export function getPersonalizedRecommendations(pm25: number, sensitivity: string = 'normal'): Recommendation[] {
  const grade = getPersonalizedGrade(pm25, sensitivity);
  const isVulnerable = sensitivity !== 'normal';

  const rec: Recommendation[] = [
    {
      icon: '🕐',
      iconClass: 'blue',
      title: '오늘의 최적 외출 시간',
      sub:
        grade.key === 'good' ? '종일 쾌적합니다!' :
        grade.key === 'moderate' ? '오전 6–10시, 저녁 8시 이후 권장' :
        isVulnerable ? '외출 자제 (실내 활동 적극 권장)' : '외출 최소화 및 마스크 필수',
    },
    {
      icon: '💨',
      iconClass: grade.key === 'good' ? 'green' : grade.key === 'moderate' ? 'yellow' : 'orange',
      title: '실내 환기',
      sub:
        grade.key === 'good' ? '자유롭게 환기 가능' :
        grade.key === 'moderate' ? '오전 중 10–15분 짧게 환기 권장' :
        '환기 자제, 공기청정기 항시 가동',
    },
    {
      icon: '😷',
      iconClass: grade.key === 'good' ? 'green' : grade.key === 'moderate' ? 'yellow' : 'orange',
      title: '마스크 착용',
      sub:
        grade.key === 'good' ? '마스크 불필요' :
        grade.key === 'moderate' ? (isVulnerable ? '보건용 KF80+ 착용 적극 권장' : '민감군만 KF80 착용 권장') :
        '외출 시 KF94 마스크 착용 필수',
    },
  ];

  if (grade.key === 'bad' || grade.key === 'very-bad') {
    rec.push({ 
      icon: '🔌', 
      iconClass: 'blue',  
      title: '공기청정기 가동', 
      sub: isVulnerable ? '강력 모드로 가동하고 실내 공기 항시 정화' : '실내 정화 모드로 가동 권장' 
    });
    rec.push({ 
      icon: '🚫', 
      iconClass: 'red',   
      title: '야외 운동 제한',  
      sub: isVulnerable ? '야외 신체 활동 금지 (실내 운동 대체)' : '고강도 야외 운동 자제 권장' 
    });
  }

  return rec;
}
