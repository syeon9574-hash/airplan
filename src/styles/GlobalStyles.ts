import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* ── 파스텔 공기질 등급 컬러 ─────────────── */
    --good:       #6BCB8B;
    --moderate:   #F5B944;
    --bad:        #FF8C7A;
    --very-bad:   #FF7FAB;

    /* ── 메인 컬러 (라벤더-블루 파스텔) ─────── */
    --primary:        #B0C4FF;
    --primary-dark:   #7B9EFF;
    --primary-deeper: #5577EE;

    /* ── 배경 / 서피스 ───────────────────────── */
    --bg:           #F2EEFF;
    --surface:      rgba(255, 255, 255, 0.88);
    --surface-border: rgba(255, 255, 255, 0.72);
    --surface-solid: #FFFFFF;

    /* ── 텍스트 ──────────────────────────────── */
    --text-primary:   #2E2657;
    --text-secondary: #9A8FC0;
    --text-muted:     #BDB5D8;

    /* ── 레이아웃 ────────────────────────────── */
    --radius:   22px;
    --radius-sm: 14px;
    --shadow:   0 8px 28px rgba(123, 158, 255, 0.14);
    --shadow-sm: 0 4px 16px rgba(123, 158, 255, 0.10);
    --nav-h:    72px;
  }

  body[data-theme='dark'] {
    /* ── 배경 / 서피스 (다크 라벤더) ─────────── */
    --bg:           #151126;
    --surface:      rgba(28, 24, 48, 0.82);
    --surface-border: rgba(255, 255, 255, 0.08);
    --surface-solid: #1E1A34;

    /* ── 텍스트 (다크 라벤더) ─────────────────── */
    --text-primary:   #EDE9FF;
    --text-secondary: #9B92C4;
    --text-muted:     #635A88;

    --shadow:   0 8px 28px rgba(0, 0, 0, 0.25);
    --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.18);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body { height: 100%; }

  body {
    font-family: 'Inter', -apple-system, 'Apple SD Gothic Neo', sans-serif;
    background: linear-gradient(160deg, #EDE9FF 0%, #F2EEFF 40%, #E8F0FF 100%);
    min-height: 100vh;
    color: var(--text-primary);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.4s ease, color 0.4s ease;
  }

  body[data-theme='dark'] {
    background: linear-gradient(160deg, #0F0D1C 0%, #151126 50%, #1A172F 100%);
  }

  /* 테마 전환 시 물들듯이 스르륵 변하는 프리미엄 효과 */
  div, p, span, button, header, section, ul, li, select, input {
    transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, box-shadow 0.35s ease;
  }

  #root {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  button { 
    font-family: inherit; 
    -webkit-tap-highlight-color: transparent;
  }

  /* 전역 스크롤바 커스텀 */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(139, 126, 248, 0.18);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 126, 248, 0.35);
  }

  select {
    border: 1.5px solid #DDD5F5;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    outline: none;
    background: white;
    width: 100%;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239A8FC0' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    cursor: pointer;
    color: var(--text-primary);
  }

  select:focus { border-color: var(--primary-dark); }

  /* ── 애니메이션 ───────────────────────────── */
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes countUp {
    from { opacity: 0; transform: scale(0.75); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes floatUp {
    0%   { transform: translateY(0px); }
    50%  { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }

  /* ── 등급 배지 ────────────────────────────── */
  .grade-good      { background: #D9F5E4; color: #3DA06A; }
  .grade-moderate  { background: #FFF0C8; color: #C8860A; }
  .grade-bad       { background: #FFE4DF; color: #D95B45; }
  .grade-very-bad  { background: #FFE0EC; color: #D64D7A; }
`;

export default GlobalStyles;
