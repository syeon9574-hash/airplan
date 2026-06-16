import React from 'react';
import styled from 'styled-components';

interface AppHeaderProps {
  title: string;
  subTitle?: string;
  rightSlot?: React.ReactNode;
}

export default function AppHeader({ title, subTitle, rightSlot }: AppHeaderProps) {
  return (
    <Header>
      <HeaderLeft>
        <h1>{title}</h1>
        {subTitle && <HeaderSub>{subTitle}</HeaderSub>}
      </HeaderLeft>
      {rightSlot && <HeaderRight>{rightSlot}</HeaderRight>}
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 20px 16px;
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }
`;

const HeaderSub = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 3px;
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
