import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMedia } from 'react-use';
import { css } from '@linaria/core';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { useTooltip } from 'tonviewer-web/hooks/useTooltip';
import { AppRoutes } from 'tonviewer-web/helpers/routes';
import { HeaderSettings } from 'tonviewer-web/components/layout/HeaderSettings';
import { GlobalSearchHeaded } from 'tonviewer-web/components/GlobalSearch/GlobalSearchHeaded';
import LogoTop from 'tonviewer-web/assets/logo/logo-top.svg';
import IcGear from 'tonviewer-web/assets/icons/ic-gear-24.svg';

const headerContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--backgroundContent);
  height: 68px;
  transition: background-color 0.2s ease-in-out;
`;

const headerContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1160px;
  padding: 0 12px;
  flex: 1;
  gap: 48px;
`;

const logoContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const logoContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const testnetStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px 12px;
  border-radius: 30px;
  background-color: var(--accentRed);
  color: var(--textContrast);
  font-size: 14px;
  font-weight: 500;
  user-select: none;
`;

const actionsContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: 12px;
`;

const settingButton = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  cursor: pointer;
`;

const searchContainer = css`
  display: flex;
  flex-direction: column;
  padding: 16px 8px 0;
  background-color: var(--backgroundMain);
`;

export const Header = React.memo(() => {
  const router = useRouter();
  const isMobile = useMedia('(max-width: 768px)');
  const isRootPath = router.route === AppRoutes.home();
  const isTestnet = (process.env.host || '').includes('testnet');

  const [showSettings] = useTooltip({
    placement: 'bottom-end',
    content: ({ hide }) => <HeaderSettings hide={hide} isTestNet={isTestnet} />
  });

  return (
    <>
      <div className={headerContainer}>
        <div className={headerContent}>
          {(!isRootPath || isTestnet) && (
            <div className={logoContent}>
              {!isRootPath && (
                <Link href="/" className={logoContainer}>
                  <LogoTop />
                </Link>
              )}
              {isTestnet && <div className={testnetStyle}>Testnet</div>}
            </div>
          )}
          <div className={actionsContent}>
            {!isMobile && !isRootPath && <GlobalSearchHeaded inHead={true} />}
            <div className={settingButton} onMouseEnter={showSettings}>
              <UIcon icon={<IcGear />} size="xlarge" color="var(--iconSecondary)" />
            </div>
          </div>
        </div>
      </div>
      {isMobile && !isRootPath && (
        <div className={searchContainer}>
          <GlobalSearchHeaded />
        </div>
      )}
    </>
  );
});
