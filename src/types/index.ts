// ── 공기질 등급 ─────────────────────────────
export interface AqiGrade {
  label: string;      // '좋음' | '보통' | '나쁨' | '매우나쁨'
  key: string;        // 'good' | 'moderate' | 'bad' | 'very-bad'
  color: string;      // hex color
  cssClass: string;   // CSS class suffix
}

// ── 앱 전역 상태 ────────────────────────────
export interface AppState {
  pm25: number;
  pm10: number;
  o3?: number;
  no2?: number;
  dataTime: string;
  alarms: Alarm[];
  apiOk: boolean;
  apiStatus: 'idle' | 'loading' | 'ok' | 'error';
  apiMessage: string;
}

// ── 경보 ────────────────────────────────────
export interface Alarm {
  issueDate?: string;
  issueTime?: string;
  area?: string;
  moveName?: string;
  issueGbn?: string;
  pollutant?: string;
  itemCode?: string;
  causeType?: string;
  clearYn: 'Y' | 'N';
}

// ── 일정 ────────────────────────────────────
export interface Schedule {
  id: number;
  type: string;
  name: string;
  startTime: string;
  endTime: string;
}

// ── 활동 유형 ────────────────────────────────
export interface ActivityType {
  key: string;
  label: string;
  icon: string;
  bg: string;
}

// ── 지역 아이템 ──────────────────────────────
export interface RegionItem {
  name: string;
  pm25: number;
}

// ── 예측 아이템 ──────────────────────────────
export interface ForecastItem {
  time: string;
  pm25: number;
}

// ── 설정 ────────────────────────────────────
export interface Settings {
  location: string;
  alertOn: boolean;
  scheduleAlertOn: boolean;
  morningAlertOn: boolean;
  sensitivity: 'normal' | 'sensitive' | 'child' | 'elderly';
  theme: 'light' | 'dark';
}

// ── 뷰 타입 ─────────────────────────────────
export type ViewType = 'home' | 'map' | 'schedule' | 'alerts' | 'settings';
