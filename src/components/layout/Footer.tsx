import React, { memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { css, cx } from '@linaria/core';
import { AppRoutes } from 'tonviewer-web/helpers/routes';
import { Body2 } from 'tonviewer-web/utils/textStyles';

const footerContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--backgroundMain);
  transition: background-color 0.2s ease-in-out;
  min-height: 92px;

  &.bg-home {
    background-color: var(--backgroundCard);
  }
`;

const footerContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1160px;
  padding: 12px;
  flex: 1;
  gap: 16px;
`;

const footerPartContent = cx(
  Body2,
  css`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    color: var(--textSecondary);
    white-space: nowrap;
  `
);

export const Footer = memo(() => {
  const router = useRouter();
  const isHome = AppRoutes.home() === router.asPath;
  return (
    <div className={cx(footerContainer, isHome && 'bg-home')}>
      <div className={footerContent}>
        <div className={footerPartContent}>
          <Link href="/">Terms</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Report Issue</Link>
        </div>
        <div className={footerPartContent}>© 2022-2023 Ton Apps Inc</div>
      </div>
    </div>
  );
});
