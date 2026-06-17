import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { MapPin, X, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { findClosestLocation } from '../../utils/airQuality';

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string, useGps?: boolean) => void;
  currentLocation: string;
}

const REGION_OPTIONS: Record<string, string[]> = {
  '서울': ['강남구', '종로구', '마포구', '서초구', '송파구', '용산구', '동대문구', '서대문구', '영등포구', '중구'],
  '경기': ['수원', '성남', '부천', '안양', '고양', '용인', '화성', '의정부'],
  '인천': ['부평', '남동구', '서구', '연수구', '계양구'],
  '부산': ['해운대', '사하구', '진구', '동래구', '북구'],
  '대구': ['중구', '수성구', '달서구', '북구'],
  '울산': ['남구', '중구', '울주군'],
  '대전': ['유성', '서구', '동구'],
  '광주': ['동구', '북구', '서구'],
  '세종': ['세종'],
  '충남': ['천안', '아산', '당진'],
  '전북': ['전주', '군산', '익산'],
  '제주': ['제주시', '서귀포시'],
};

export default function LocationSelectModal({ isOpen, onClose, onSelect, currentLocation }: LocationSelectModalProps) {
  const parts = currentLocation.split(' ');
  const initialSido = parts.length > 1 ? parts[0] : '서울';
  const [selectedSido, setSelectedSido] = useState(initialSido);
  const tabsRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 현재 시도로 동기화
  useEffect(() => {
    if (isOpen) {
      const p = currentLocation.split(' ');
      setSelectedSido(p.length > 1 ? p[0] : '서울');
    }
  }, [isOpen, currentLocation]);

  const [isLocating, setIsLocating] = useState(false);

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      alert('GPS 기능을 지원하지 않는 브라우저입니다.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const closest = findClosestLocation(latitude, longitude);
        onSelect(closest, true);
        setIsLocating(false);
        onClose();
      },
      (error) => {
        console.warn(error);
        alert('현재 위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'right' ? 120 : -120, behavior: 'smooth' });
  };

  const currentDistrict = parts.length > 1 ? parts[1] : parts[0];
  const districts = REGION_OPTIONS[selectedSido] || [];

  return (
    <Overlay $open={isOpen} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="지역 선택">
      <Dialog $open={isOpen} onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <DialogHeader>
          <ModalTitle>
            <MapPin size={16} color="#7B6EE8" style={{ marginRight: 6 }} /> 측정 지역 선택
          </ModalTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">
            <X size={18} />
          </CloseBtn>
        </DialogHeader>
        <Description>실시간 미세먼지 정보를 조회할 시도와 세부 지역을 선택하세요.</Description>

        <GpsButton onClick={handleGpsLocate} disabled={isLocating}>
          <Navigation size={13} style={{ marginRight: 6 }} />
          {isLocating ? '현재 위치 측정 중...' : '현재 GPS 위치로 자동 설정'}
        </GpsButton>

        {/* 시도 탭 — 좌우 화살표 버튼 */}
        <SidoRow>
          <ArrowBtn onClick={() => scrollTabs('left')} aria-label="이전">
            <ChevronLeft size={16} />
          </ArrowBtn>
          <SidoTabs ref={tabsRef}>
            {Object.keys(REGION_OPTIONS).map(sido => (
              <SidoTabBtn
                key={sido}
                $active={selectedSido === sido}
                onClick={() => setSelectedSido(sido)}
              >
                {sido}
              </SidoTabBtn>
            ))}
          </SidoTabs>
          <ArrowBtn onClick={() => scrollTabs('right')} aria-label="다음">
            <ChevronRight size={16} />
          </ArrowBtn>
        </SidoRow>

        <Divider />

        {/* 선택된 시도 이름 */}
        <SidoLabel>{selectedSido} 지역 선택</SidoLabel>

        {/* 구/시 선택 그리드 */}
        <GridWrap>
          {districts.map(district => {
            const isSelected = selectedSido === initialSido && currentDistrict === district;
            return (
              <DistrictBtn
                key={district}
                $selected={isSelected}
                onClick={() => {
                  onSelect(selectedSido === '세종' ? '세종' : `${selectedSido} ${district}`, false);
                  onClose();
                }}
              >
                {isSelected && <SelectedDot />}
                {district}
              </DistrictBtn>
            );
          })}
        </GridWrap>
      </Dialog>
    </Overlay>
  );
}

// ── 애니메이션 ────────────────────────────────
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.88) translateY(12px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
`;

// ── styled-components ─────────────────────────

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(30, 24, 60, 0.52);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 210;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  opacity: ${({ $open }) => $open ? 1 : 0};
  pointer-events: ${({ $open }) => $open ? 'all' : 'none'};
  transition: opacity 0.25s ease;
`;

/* 중앙 다이얼로그 카드 */
const Dialog = styled.div<{ $open: boolean }>`
  background: var(--surface-solid);
  border-radius: 28px;
  width: 100%;
  max-width: 390px;
  max-height: 82vh;
  padding: 26px 22px 28px;
  box-shadow: 0 24px 64px rgba(30, 24, 60, 0.30);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${({ $open }) => $open ? popIn : 'none'} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

const ModalTitle = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(139, 126, 248, 0.10);
  border: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(139, 126, 248, 0.20);
    color: var(--text-primary);
  }
`;

const Description = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 18px;
  font-weight: 500;
  line-height: 1.5;
  flex-shrink: 0;
`;

/* 시도 탭 행 — 화살표 + 스크롤 영역 */
const SidoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-bottom: 0;
`;

/* 좌/우 스크롤 버튼 */
const ArrowBtn = styled.button`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--surface-border);
  background: var(--surface);
  font-size: 18px;
  line-height: 1;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s;

  &:hover {
    background: rgba(139, 126, 248, 0.12);
    color: #7B6EE8;
    border-color: #8B7EF8;
  }
  &:active { transform: scale(0.92); }
`;

/* 가로 스크롤 탭 목록 */
const SidoTabs = styled.div`
  display: flex;
  gap: 6px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  padding: 2px 0 10px;
`;

const SidoTabBtn = styled.button<{ $active: boolean }>`
  padding: 8px 15px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid ${({ $active }) => $active ? '#8B7EF8' : 'var(--surface-border)'};
  background: ${({ $active }) => $active ? 'rgba(139,126,248,0.12)' : 'var(--surface)'};
  color: ${({ $active }) => $active ? '#7B6EE8' : 'var(--text-secondary)'};
  transition: all 0.18s;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: ${({ $active }) => $active ? '0 2px 10px rgba(139,126,248,0.22)' : 'none'};

  &:active { transform: scale(0.94); }
`;

const Divider = styled.div`
  height: 1.5px;
  background: var(--surface-border);
  margin-bottom: 14px;
  flex-shrink: 0;
`;

const SidoLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

/* 구/시 그리드 — 넘치면 세로 스크롤 */
const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 2px;
  scrollbar-width: thin;
  scrollbar-color: #DDD5F5 transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: #DDD5F5;
    border-radius: 10px;
  }
`;

const DistrictBtn = styled.button<{ $selected: boolean }>`
  position: relative;
  padding: 13px 6px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  border: 1.5px solid ${({ $selected }) => $selected ? '#8B7EF8' : 'var(--surface-border)'};
  background: ${({ $selected }) => $selected ? 'rgba(139,126,248,0.1)' : 'var(--surface)'};
  color: ${({ $selected }) => $selected ? '#7B6EE8' : 'var(--text-secondary)'};
  transition: all 0.18s;
  box-shadow: ${({ $selected }) => $selected ? '0 4px 14px rgba(139,126,248,0.22)' : 'none'};

  &:hover {
    border-color: rgba(139, 126, 248, 0.5);
    color: #7B6EE8;
  }
  &:active { transform: scale(0.94); }
`;

const SelectedDot = styled.span`
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8B7EF8;
  margin: 0 auto 4px;
`;

const GpsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background: rgba(123, 110, 232, 0.08);
  border: 1.5px dashed var(--primary);
  border-radius: 14px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(123, 110, 232, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
