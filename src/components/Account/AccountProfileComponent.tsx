import React from 'react';
import QRCode from 'qrcode.react';
import { css, cx } from '@linaria/core';
import { Account } from 'tonapi-sdk-js';
import { TitleH4, Label2, Body2 } from 'tonviewer-web/utils/textStyles';
import { convertNanoton, addressToBase64, sliceString } from 'tonviewer-web/helpers';
import { prettifyPrice } from 'tonviewer-web/helpers/numbers';

const accountContainer = css`
  display: flex;
  flex-direction: row;
  padding: 20px 24px;
`;

const sectionContent = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const rowContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const itemContainer = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const itemTitle = cx(
  Body2,
  css`
    color: var(--textSecondary);
  `
);

const itemText = cx(
  Label2,
  css`
    color: var(--textPrimary);
  `
);

const qrContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

interface AccountItemContentProps {
  title: string;
  text?: string;
  content?: React.ReactNode;
}

const AccountItemContent = React.memo((props: AccountItemContentProps) => {
  return (
    <div className={itemContainer}>
      <div className={itemTitle}>{props.title}</div>
      {!!props.text && <div className={itemText}>{props.text}</div>}
      {!!props.content && props.content}
    </div>
  );
});

const balanceContent = cx(
  TitleH4,
  css`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--textSecondary);
    gap: 6px;

    & .ton-balance {
      color: var(--textPrimary);
    }
  `
);

interface AccountProfileComponentProps {
  account: Account;
  balanceUSD: number;
}

export const AccountProfileComponent = React.memo((props: AccountProfileComponentProps) => {
  const { address, balance, interfaces } = props.account;
  return (
    <div className={accountContainer}>
      <div className={sectionContent}>
        <AccountItemContent title="Address" text={addressToBase64(address)} />
        <AccountItemContent
          title="Balance"
          content={
            <div className={balanceContent}>
              <div className="ton-balance">{prettifyPrice(convertNanoton(balance))} TON</div>
              <div>≈</div>
              <div>${prettifyPrice(props.balanceUSD)}</div>
            </div>
          }
        />
        <div className={rowContent}>
          <AccountItemContent title="Contract type" text={interfaces.join(', ')} />
          <AccountItemContent title="Raw" text={sliceString(address)} />
        </div>
      </div>
      <div className={sectionContent}>
        <div className={qrContainer}>
          <QRCode
            value={`ton://transfer/${address}`}
            size={132}
            bgColor="transparent"
            fgColor="var(--iconPrimary)"
            renderAs="svg"
            includeMargin={false}
            level={'L'}
          />
        </div>
      </div>
    </div>
  );
});
