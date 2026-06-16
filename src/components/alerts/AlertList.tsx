import { useState } from 'react';
import styled from 'styled-components';
import { 
  PartyPopper, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Shield, 
  Activity, 
  Home, 
  Droplets 
} from 'lucide-react';
import type { Alarm } from '../../types';

interface AlertListProps {
  alarms: Alarm[];
}

export default function AlertList({ alarms }: AlertListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (alarms.length === 0) {
    return (
      <ListWrap id="alert-list">
        <EmptyState>
          <EmptyIcon>
            <PartyPopper size={48} color="#7B6EE8" strokeWidth={1.5} />
          </EmptyIcon>
          <EmptyTitle>현재 발령 중인 경보가 없어요</EmptyTitle>
          <EmptySub>
            공기가 맑고 쾌적합니다 <Sparkles size={11} color="#6BCB8B" style={{ display: 'inline', marginLeft: 2 }} />
          </EmptySub>
        </EmptyState>
      </ListWrap>
    );
  }

  return (
    <ListWrap id="alert-list">
      {alarms.map((a, i) => {
        const isActive = a.clearYn === 'N';
        const isWarning = a.issueGbn?.includes('경보');
        const iconBg = isWarning ? 'rgba(214, 77, 122, 0.12)' : 'rgba(200, 134, 10, 0.12)';
        const iconColor = isWarning ? '#D64D7A' : '#C8860A';
        const pollutant = a.pollutant || a.itemCode || '미세먼지';
        const area = a.area || a.moveName || '전국';

        return (
          <AlertCard 
            key={i} 
            $unread={isActive} 
            style={{ animationDelay: `${i * 0.06}s`, cursor: 'pointer' }}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <CardTop>
              <AlertIconWrap style={{ background: iconBg }}>
                {isWarning ? (
                  <ShieldAlert size={20} color={iconColor} />
                ) : (
                  <AlertTriangle size={20} color={iconColor} />
                )}
              </AlertIconWrap>
              <AlertBody>
                <AlertTitle>
                  {isActive && <LiveDot />}
                  {a.issueGbn || '안내'} — {pollutant}
                </AlertTitle>
                <AlertMsg>
                  발령 지역: {area}<br />
                  상태: {isActive ? '발령 중' : '해제'}
                </AlertMsg>
                <AlertTime>{a.issueDate} {a.issueTime}</AlertTime>
              </AlertBody>
              <StatusBadge $active={isActive}>
                {isActive ? '발령 중' : '해제'}
              </StatusBadge>
            </CardTop>
            
            <AccordionContent $isOpen={expandedIndex === i}>
              <AccordionInner>
                <Divider />
                <GuideTitle>
                  <BookOpen size={13} color="#7B6EE8" style={{ marginRight: 6 }} /> 행동 요령 및 예방 가이드
                </GuideTitle>
                <GuideList>
                  <li>
                    <Shield size={12} color="#7B6EE8" />
                    <span><strong>보건용 마스크(KF80 이상)</strong>를 반드시 착용해 주세요.</span>
                  </li>
                  <li>
                    <Activity size={12} color="#7B6EE8" />
                    <span>무리한 실외 운동이나 실외 야외 일정을 자제하고 실내로 활동을 변경하세요.</span>
                  </li>
                  <li>
                    <Home size={12} color="#7B6EE8" />
                    <span>실내 환기는 자제하시고, 공기청정기를 사용하여 실내 공기를 관리하세요.</span>
                  </li>
                  <li>
                    <Droplets size={12} color="#7B6EE8" />
                    <span>충분한 수분을 섭취하여 노폐물 배출을 도와주세요.</span>
                  </li>
                </GuideList>
              </AccordionInner>
            </AccordionContent>
          </AlertCard>
        );
      })}
    </ListWrap>
  );
}

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 60px;
  margin-bottom: 14px;
`;

const EmptyTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

const EmptySub = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
  font-weight: 500;
`;

const AlertCard = styled.div<{ $unread: boolean }>`
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1.5px solid ${({ $unread }) => $unread ? 'rgba(176, 196, 255, 0.6)' : 'var(--surface-border)'};
  border-left: ${({ $unread }) => $unread ? '4px solid #A89EF0' : '1.5px solid var(--surface-border)'};
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $unread }) => $unread ? '0 4px 16px rgba(168, 158, 240, 0.18)' : 'var(--shadow-sm)'};
  animation: slideIn 0.35s ease both;
  transition: transform 0.2s, border-color 0.2s;

  &:active { transform: scale(0.99); }
`;

const CardTop = styled.div`
  display: flex;
  gap: 14px;
  width: 100%;
`;

const AlertIconWrap = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  flex-shrink: 0;
`;

const AlertBody = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.1px;
  display: flex;
  align-items: center;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  background: #D64D7A;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  flex-shrink: 0;
  box-shadow: 0 0 6px #D64D7A;
`;

const AlertMsg = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
  line-height: 1.55;
  font-weight: 500;
`;

const AlertTime = styled.div`
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  padding: 4px 11px;
  border-radius: 100px;
  height: fit-content;
  background: ${({ $active }) => $active ? '#FFE0EC' : '#D9F5E4'};
  color: ${({ $active }) => $active ? '#D64D7A' : '#3DA06A'};
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => $isOpen ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
`;

const AccordionInner = styled.div`
  padding-top: 14px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(213, 204, 245, 0.22);
  margin-bottom: 12px;
`;

const GuideTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const GuideList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
    
    svg {
      margin-top: 3px;
      flex-shrink: 0;
    }
  }
`;
