import React, { PropsWithChildren, CSSProperties } from 'react';
import { css, cx } from '@linaria/core';
import { AppRoutes } from '../../../helpers/routes';
import { useRouter } from 'next/router';

const container = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  background-color: var(--backgroundMain);
  transition: background-color .2s ease-in-out;

  &.bg-home {
    background-color: var(--backgroundCard);
  }

  @media (max-width: 768px) {
    padding-top: 12px;
  }
`;

const content = css`
  display: flex;
  align-self: stretch;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 0 8px;
  }
`;

type LayoutProps = {
  isApps?: boolean;
  style?: CSSProperties;
};

export const Layout = ({ children, style }: PropsWithChildren<LayoutProps>) => {
  const router = useRouter();
  const isHome = AppRoutes.home() === router.asPath;

  return (
    <div className={cx(container, isHome && 'bg-home')}>
      <div className={content} style={style}>
        {children}
      </div>
    </div>
  );
};
