import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { RefreshCw, Sun, CloudSun, Moon } from 'lucide-react';
import { getDateString, getGreetingText } from '../../utils/airQuality';

interface GreetingBarProps {
  apiStatus: 'idle' | 'loading' | 'ok' | 'error';
  apiMessage: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function GreetingBar({ apiStatus, apiMessage, onRefresh, isRefreshing }: GreetingBarProps) {
  const dateRef = useRef(getDateString());
  const greetRef = useRef(getGreetingText());

  useEffect(() => {
    dateRef.current = getDateString();
    greetRef.current = getGreetingText();
  }, []);

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    const size = 22;
    if (hour < 12) return <Sun size={size} color="#FFB300" style={{ marginLeft: 6 }} />;
    if (hour < 18) return <CloudSun size={size} color="#FFB300" style={{ marginLeft: 6 }} />;
    return <Moon size={size} color="#7B6EE8" style={{ marginLeft: 6 }} />;
  };

  return (
    <>
      <GreetingWrap>
        <GreetingLeft>
          <GreetingDate id="home-date">{dateRef.current}</GreetingDate>
          <GreetingText id="home-greeting">
            {greetRef.current}
            {getGreetingIcon()}
          </GreetingText>
        </GreetingLeft>
        <RefreshBtn
          id="refresh-btn"
          onClick={onRefresh}
          title="데이터 새로고침"
          aria-label="새로고침"
          $spinning={isRefreshing}
        >
          <RefreshCw size={16} />
        </RefreshBtn>
      </GreetingWrap>
      {apiStatus === 'loading' && (
        <ApiStatus $type={apiStatus}>{apiMessage}</ApiStatus>
      )}
    </>
  );
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const GreetingWrap = styled.div`
  padding: 52px 20px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const GreetingLeft = styled.div``;

const GreetingDate = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 5px;
  font-weight: 500;
`;

const GreetingText = styled.div`
  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
`;

const RefreshBtn = styled.button<{ $spinning: boolean }>`
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  color: var(--text-secondary);
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.2s, background 0.2s;
  box-shadow: var(--shadow-sm);
  animation: ${({ $spinning }) => $spinning ? spin : 'none'} 0.6s linear;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: scale(1.06);
    background: rgba(139, 126, 248, 0.08);
    color: #7B6EE8;
    border-color: #8B7EF8;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const ApiStatus = styled.div<{ $type: 'idle' | 'loading' | 'ok' | 'error' }>`
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  margin: 0 16px 10px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;

  ${({ $type }) => $type === 'loading' && `background: #EDE9FF; color: #7B6EE8;`}
  ${({ $type }) => $type === 'ok'      && `background: #D9F5E4; color: #3DA06A;`}
  ${({ $type }) => $type === 'error'   && `background: #FFF5D9; color: #C8860A;`}
`;
