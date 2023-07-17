import React from 'react';
import useDarkMode from 'use-dark-mode';
import { css, cx } from '@linaria/core';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { Label2 } from 'tonviewer-web/utils/textStyles';
import IcMoon from 'tonviewer-web/assets/icons/ic-moon-24.svg';
import IcTestNet from 'tonviewer-web/assets/icons/ic-test-net-24.svg';

const settingsContainer = css`
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundContent);
  transition: background-color 0.2s ease-in-out;
  border-radius: 12px;
  padding: 8px 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04), 0px 4px 20px rgba(0, 0, 0, 0.12);
`;

const switcherContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  padding: 8px;
  cursor: pointer;
`;

const iconContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const titleStyle = cx(
  Label2,
  css`
    color: var(--textPrimary);
    flex: 1;
  `
);

const toggleContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--iconTertiary);
  margin-left: 8px;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  padding: 2px;

  & .circle {
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background-color: var(--textContrast);
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
    transform: translateX(0);
  }

  &.active {
    background-color: var(--accentBlue);
    & .circle {
      transform: translateX(16px);
    }
  }
`;

type SwitcherProps = {
  title: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
};

const Switcher = React.memo((props: SwitcherProps) => {
  return (
    <div className={switcherContainer} onClick={props.onClick}>
      <div className={iconContainer}>
        <UIcon icon={props.icon} size="xlarge" color="var(--iconSecondary)" />
      </div>
      <div className={titleStyle}>{props.title}</div>
      <div className={cx(toggleContent, props.active && 'active')}>
        <div className="circle" />
      </div>
    </div>
  );
});

export const HeaderSettings = React.memo((props: { isTestNet: boolean; hide: () => void }) => {
  const darkMode = useDarkMode();

  const switchTestnet = () => {
    window.location.href = props.isTestNet ? 'https://tonviewer.com/' : 'https://testnet.tonviewer.com/';
  };

  return (
    <div className={settingsContainer}>
      <Switcher title="Dark mode" active={darkMode.value} icon={<IcMoon />} onClick={darkMode.toggle} />
      <Switcher title="Testnet" active={props.isTestNet} icon={<IcTestNet />} onClick={switchTestnet} />
    </div>
  );
});
