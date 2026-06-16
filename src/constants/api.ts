// ── 에어코리아 API 설정 ───────────────────────
export const API_KEY = import.meta.env.VITE_AIR_KOREA_API_KEY || '883043c18f78f90e9db0f95deb45c7a89cc5347100abf7f3bb0c109e1f9c9639';
export const BASE = 'https://apis.data.go.kr/B552584';
export const CORS_PROXY = 'https://corsproxy.io/?url=';

// 실시간 측정 API
export const REALTIME_URL = `${BASE}/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`;
// 경보 발령 현황 API
export const ALARM_URL = `${BASE}/UlfptcaAlarmInqireSvc/getUlfptcaAlarmOccrrncInfoInqire`;
// 시도별 실시간 측정 API
export const SIDO_URL = `${BASE}/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty`;

// 기본 측정소
export const DEFAULT_STATION = '강남구';
