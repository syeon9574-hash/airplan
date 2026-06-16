import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, Schedule, Settings, ViewType } from '../types';
import { FALLBACK } from '../constants/regionData';

// ── 기본 설정값 ─────────────────────────────
const DEFAULT_SETTINGS: Settings = {
  location: '서울 강남구',
  alertOn: true,
  scheduleAlertOn: true,
  morningAlertOn: false,
  sensitivity: 'normal',
  theme: 'light',
};

const loadStoredSettings = (): Settings => {
  try {
    return JSON.parse(localStorage.getItem('airplan_settings') || JSON.stringify(DEFAULT_SETTINGS));
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const loadStoredSchedules = (): Schedule[] => {
  try {
    return JSON.parse(localStorage.getItem('airplan_schedules') || '[]');
  } catch {
    return [];
  }
};

// ── 초기 앱 상태 ─────────────────────────────
const INITIAL_APP_STATE: AppState = {
  pm25: FALLBACK.pm25,
  pm10: FALLBACK.pm10,
  o3: FALLBACK.o3,
  no2: FALLBACK.no2,
  dataTime: FALLBACK.dataTime,
  alarms: [],
  apiOk: false,
  apiStatus: 'idle',
  apiMessage: '',
};

// ── Context 타입 ─────────────────────────────
interface AppContextType {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  schedules: Schedule[];
  addSchedule: (item: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: number) => void;
  settings: Settings;
  saveSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

// ── Context 생성 ─────────────────────────────
const AppContext = createContext<AppContextType | null>(null);

// ── Provider ─────────────────────────────────
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(INITIAL_APP_STATE);
  const [schedules, setSchedules] = useState<Schedule[]>(loadStoredSchedules);
  const [settings, setSettings] = useState<Settings>(loadStoredSettings);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 테마 초기화 및 변경 감지
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme || 'light');
  }, [settings.theme]);

  const addSchedule = useCallback((item: Omit<Schedule, 'id'>) => {
    setSchedules(prev => {
      const next = [{ ...item, id: Date.now() }, ...prev];
      localStorage.setItem('airplan_schedules', JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteSchedule = useCallback((id: number) => {
    setSchedules(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('airplan_schedules', JSON.stringify(next));
      return next;
    });
  }, []);

  const saveSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('airplan_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      appState, setAppState,
      schedules, addSchedule, deleteSchedule,
      settings, saveSetting,
      currentView, setCurrentView,
      isModalOpen, setIsModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ── 커스텀 훅 ────────────────────────────────
export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
