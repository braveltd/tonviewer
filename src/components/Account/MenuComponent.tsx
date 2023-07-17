import React from 'react';
import copy from 'copy-to-clipboard';
import { css, cx } from '@linaria/core';
import { Body2, Label2 } from 'tonviewer-web/utils/textStyles';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import IcDone from 'tonviewer-web/assets/icons/ic-done-16.svg';
import IcCopy from 'tonviewer-web/assets/icons/ic-copy-outline-16.svg';

const moreContainer = css`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  @media (max-width: 1440px) {
    padding: 12px 0;
  }
`;

const menuContent = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 24px;
  background-color: var(--backgroundContent);
  border-radius: 12px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.12), 0px 4px 4px 0px rgba(0, 0, 0, 0.04);
  max-width: 350px;
  max-height: 300px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;

const moreSection = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const moreTitle = cx(
  Body2,
  css`
    color: var(--textSecondary);
  `
);

const moreTextContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const moreText = cx(
  Label2,
  css`
    color: var(--textPrimary);
    white-space: pre-wrap;
    word-break: break-all;
  `
);

interface MenuContentProps {
  data: {
    title: string;
    text: string;
    copyText?: string;
  }[];
}

export const MenuComponent = React.memo((props: MenuContentProps) => {
  const [isCopy, setIsCopy] = React.useState(false);

  const handleCopy = React.useCallback((val: string) => {
    copy(val);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 500);
  }, []);

  return (
    <div className={moreContainer}>
      <div className={menuContent}>
        {props.data.map((i, j) => (
          <div key={'popper_' + j} className={moreSection}>
            <div className={moreTitle}>{i.title}</div>
            <div className={moreTextContainer}>
              <div className={moreText}>{i.text}</div>
              {!!i.copyText && (
                <UIcon
                  icon={isCopy ? <IcDone /> : <IcCopy />}
                  color={isCopy ? 'var(--accentGreen)' : 'var(--iconSecondary)'}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopy(i.copyText);
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
