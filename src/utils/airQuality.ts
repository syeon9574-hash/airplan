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

// ── GPS 기반 위치 변환 ─────────────────────────
export const SIDO_COORDS = [
  // 서울
  { name: '서울 강남구', lat: 37.5172, lng: 127.0473 },
  { name: '서울 종로구', lat: 37.5730, lng: 126.9794 },
  { name: '서울 마포구', lat: 37.5635, lng: 126.9084 },
  { name: '서울 서초구', lat: 37.4837, lng: 127.0324 },
  { name: '서울 송파구', lat: 37.5145, lng: 127.1062 },
  { name: '서울 용산구', lat: 37.5384, lng: 126.9654 },
  { name: '서울 동대문구', lat: 37.5744, lng: 127.0400 },
  { name: '서울 서대문구', lat: 37.5791, lng: 126.9368 },
  { name: '서울 영등포구', lat: 37.5264, lng: 126.8962 },
  { name: '서울 중구', lat: 37.5637, lng: 126.9975 },

  // 경기
  { name: '경기 수원', lat: 37.2911, lng: 127.0089 },
  { name: '경기 성남', lat: 37.4201, lng: 127.1265 },
  { name: '경기 부천', lat: 37.5034, lng: 126.7660 },
  { name: '경기 안양', lat: 37.3897, lng: 126.9535 },
  { name: '경기 고양', lat: 37.6584, lng: 126.8320 },
  { name: '경기 용인', lat: 37.2410, lng: 127.1779 },
  { name: '경기 화성', lat: 37.1995, lng: 126.8312 },
  { name: '경기 의정부', lat: 37.7381, lng: 127.0337 },

  // 인천
  { name: '인천 부평', lat: 37.4952, lng: 126.7201 },
  { name: '인천 남동구', lat: 37.4472, lng: 126.7314 },
  { name: '인천 서구', lat: 37.5452, lng: 126.6744 },
  { name: '인천 연수구', lat: 37.4097, lng: 126.6784 },
  { name: '인천 계양구', lat: 37.5385, lng: 126.7377 },

  // 부산
  { name: '부산 해운대', lat: 35.1631, lng: 129.1636 },
  { name: '부산 사하구', lat: 35.1044, lng: 128.9748 },
  { name: '부산 진구', lat: 35.1601, lng: 129.0573 },
  { name: '부산 동래구', lat: 35.2048, lng: 129.0838 },
  { name: '부산 북구', lat: 35.1970, lng: 128.9903 },

  // 대구
  { name: '대구 중구', lat: 35.8694, lng: 128.6062 },
  { name: '대구 수성구', lat: 35.8581, lng: 128.6306 },
  { name: '대구 달서구', lat: 35.8285, lng: 128.5329 },
  { name: '대구 북구', lat: 35.8860, lng: 128.5930 },

  // 울산
  { name: '울산 남구', lat: 35.5420, lng: 129.3245 },
  { name: '울산 중구', lat: 35.5681, lng: 129.3330 },
  { name: '울산 울주군', lat: 35.5348, lng: 129.1532 },

  // 대전
  { name: '대전 유성', lat: 36.3622, lng: 127.3563 },
  { name: '대전 서구', lat: 36.3553, lng: 127.3838 },
  { name: '대전 동구', lat: 36.3312, lng: 127.4564 },

  // 광주
  { name: '광주 동구', lat: 35.1461, lng: 126.9231 },
  { name: '광주 북구', lat: 35.1741, lng: 126.9121 },
  { name: '광주 서구', lat: 35.1520, lng: 126.8485 },

  // 세종
  { name: '세종', lat: 36.4800, lng: 127.2890 },

  // 충남
  { name: '충남 천안', lat: 36.8151, lng: 127.1139 },
  { name: '충남 아산', lat: 36.7898, lng: 127.0048 },
  { name: '충남 당진', lat: 36.8996, lng: 126.6290 },

  // 전북
  { name: '전북 전주', lat: 35.8242, lng: 127.1480 },
  { name: '전북 군산', lat: 35.9677, lng: 126.7366 },
  { name: '전북 익산', lat: 35.9483, lng: 126.9576 },

  // 제주
  { name: '제주 제주시', lat: 33.4996, lng: 126.5312 },
  { name: '제주 서귀포시', lat: 33.2541, lng: 126.5601 }
];

export function findClosestLocation(lat: number, lng: number): string {
  let minDistance = Infinity;
  let closest = SIDO_COORDS[0].name;
  for (const item of SIDO_COORDS) {
    const d = Math.pow(item.lat - lat, 2) + Math.pow(item.lng - lng, 2);
    if (d < minDistance) {
      minDistance = d;
      closest = item.name;
    }
  }
  return closest;
}
