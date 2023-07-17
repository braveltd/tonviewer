import React from 'react';
import { css, cx } from '@linaria/core';
import { Event } from 'tonapi-sdk-js';
import copy from 'copy-to-clipboard';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { Body2, Label1 } from 'tonviewer-web/utils/textStyles';
import { eventFormatter, SortEventT } from 'tonviewer-web/utils/transactionFormatter';
import { sliceString } from 'tonviewer-web/helpers';
import { unixTimeToTimestamp } from 'tonviewer-web/utils/dateTimeFormatter';
import IcCopy from 'tonviewer-web/assets/icons/ic-copy-outline-16.svg';
import IcDone from 'tonviewer-web/assets/icons/ic-done-16.svg';
import { TransactionActionComponent } from 'tonviewer-web/components/Transaction/TransactionActionComponent';

const transactionContainer = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-self: stretch;
  gap: 4px;
`;

const actionsContent = css`
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundContent);
  padding: 8px;
`;

const headerContainer = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
`;

const footerContainer = css`
  display: grid;
  grid-template-columns: 17% 83%;
  padding: 16px 24px;
  border-radius: 0 0 16px 16px;
  background-color: var(--backgroundContent);

  @media (max-width: 1000px) {
    grid-template-columns: 22% 78%;
  }
  
  @media (max-width: 768px) {
    grid-template-areas: 'a' 'b';
    grid-template-columns: 100%;
    gap: 4px;
  }
`;

const footerItem = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const titleStyle = cx(
  Label1,
  css`
    display: flex;
    flex-direction: column;
    padding: 19px 24px;
    border-radius: 16px 16px 0 0;
    background-color: var(--backgroundContent);
    gap: 8px;
    color: var(--textPrimary);
  `
);

const footerText = cx(
  Body2,
  css`
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    gap: 8px;
    color: var(--textPrimary);

    & .sf-mono {
      font-family: 'SF Mono';
    }

    & .icon-content {
      display: none;
    }

    &:hover .icon-content {
      display: flex;
    }
  `
);

const textSecondaryStyle = cx(
  Body2,
  css`
    color: var(--textSecondary);
  `
);

const columnsContainer = css`
  padding: 16px 24px;
  display: grid;
  grid-template-columns: 17% 38% 27% 18%;
  background-color: var(--backgroundContent);

  @media (max-width: 1000px) {
    grid-template-columns: 22% 35% 25% 18%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const columnText = cx(
  textSecondaryStyle,
  css`
    &.text-right {
      text-align: right;
    }
  `
);

const TransactionHeader = React.memo((props: { event: SortEventT }) => {
  return (
    <div className={headerContainer}>
      <div className={titleStyle}>Overview</div>
      <div className={columnsContainer}>
        <div className={columnText}>Action</div>
        <div className={columnText}>Route</div>
        <div className={columnText}>Comment</div>
        <div className={cx(columnText, 'text-right')}>Value</div>
      </div>
    </div>
  );
});

const TransactionFooter = React.memo((props: { event: SortEventT }) => {
  const [isCopy, setIsCopy] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    copy(props.event.eventId);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 500);
  }, []);

  return (
    <div className={footerContainer}>
      <div className={footerItem}>
        <div className={textSecondaryStyle}>Timestamp</div>
        <div className={footerText}>{unixTimeToTimestamp(props.event.timestamp)}</div>
      </div>
      <div className={footerItem}>
        <div className={textSecondaryStyle}>Hash</div>
        <div className={footerText}>
          <div className="sf-mono">{sliceString(props.event.eventId)}</div>
          <UIcon
            icon={isCopy ? <IcDone /> : <IcCopy />}
            color={isCopy ? 'var(--accentGreen)' : 'var(--iconSecondary)'}
            onClick={handleCopy}
          />
        </div>
      </div>
    </div>
  );
});

export const TransactionComponent = React.memo((props: { event: Event }) => {
  const event = eventFormatter(props.event);
  return (
    <div className={transactionContainer}>
      <TransactionHeader event={event} />
      <div className={actionsContent}>
        {event.actions.map((i, j) => (
          <TransactionActionComponent key={event.lt + j} action={i} />
        ))}
      </div>
      <TransactionFooter event={event} />
    </div>
  );
});
