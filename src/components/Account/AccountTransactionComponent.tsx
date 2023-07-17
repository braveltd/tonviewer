import React from 'react';
import Link from 'next/link';
import { css, cx } from '@linaria/core';
import { AccountActionComponent } from 'tonviewer-web/components/Account/AccountActionComponent';
import { SortEventsT } from 'tonviewer-web/utils/eventsFormatter';
import { unixTimeFromNow, unixTimeToTimestamp } from 'tonviewer-web/utils/dateTimeFormatter';
import { sliceString } from 'tonviewer-web/helpers';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { useLayout } from 'tonviewer-web/hooks/useLayout';
import { useTooltip } from 'tonviewer-web/hooks/useTooltip';
import { MenuComponent } from 'tonviewer-web/components/Account/MenuComponent';
import { Body2 } from 'tonviewer-web/utils/textStyles';
import IcChevronDown from 'tonviewer-web/assets/icons/ic-chevron-down-16.svg';

const transactionContainer = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2px 8px;
  background-color: var(--backgroundContent);

  @media (max-width: 768px) {
    padding: 0;
    background-color: transparent;
  }
`;

const transactionContent = css`
  display: grid;
  align-items: flex-start;
  grid-template-areas: 'date action';
  grid-template-columns: 15% 85%;

  @media (max-width: 1000px) {
    grid-template-areas: 'date' 'action';
    grid-template-columns: 100%;
  }
`;

const showMoreContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 4px 0;
    background-color: var(--backgroundContent);
  }
`;

const showMoreContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  gap: 6px;
  cursor: pointer;

  &.open svg {
    transform: rotate(180deg);
  }
`;

const showMoreStyle = cx(
  Body2,
  css`
    color: var(--textTertiary);
  `
);

const transactionDateContainer = css`
  grid-area: date;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px;

  @media (max-width: 768px) {
    background-color: var(--backgroundContent);
  }
`;

const transactionDateContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const transactionDateText = cx(
  Body2,
  css`
    white-space: nowrap;
    color: var(--textSecondary);
  `
);

const transactionActionsContent = css`
  grid-area: action;
  display: grid;
  grid-template-columns: 100%;
  align-self: stretch;
  gap: 2px;
`;

interface TransactionItemProps {
  transaction: SortEventsT;
}

export const AccountTransactionComponent = React.memo((props: TransactionItemProps) => {
  const { width } = useLayout();
  const [showAll, setShowAll] = React.useState(false);
  const { transaction } = props;
  const { actions } = transaction;

  const [show] = useTooltip({
    placement: width > 1440 ? 'left-end' : 'top-end',
    content: () => (
      <MenuComponent
        data={[
          {
            title: 'Timestamp',
            text: unixTimeToTimestamp(transaction.timestamp)
          },
          {
            title: 'Hash',
            text: sliceString(transaction.eventId),
            copyText: transaction.eventId
          }
        ]}
      />
    )
  });

  const showingActions = React.useMemo(() => {
    return showAll ? actions : actions.length > 5 ? actions.slice(0, 5) : actions;
  }, [showAll]);

  return (
    <Link href={`/transaction/${props.transaction.eventId}`} className={transactionContainer}>
      <div className={transactionContent}>
        <div className={transactionDateContainer}>
          <div className={transactionDateContent} onMouseEnter={show}>
            <div className={transactionDateText}>{unixTimeFromNow(transaction.timestamp)}</div>
          </div>
        </div>
        <div className={transactionActionsContent}>
          {showingActions.map((i, j) => (
            <AccountActionComponent key={'action' + props.transaction.lt + j} action={i} transaction={transaction} />
          ))}
        </div>
      </div>
      {actions.length > 5 && (
        <div
          className={showMoreContainer}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            setShowAll(!showAll);
          }}
        >
          <div className={cx(showMoreContent, showAll && 'open')}>
            <UIcon icon={<IcChevronDown />} color="var(--iconSecondary)" />
            <div className={showMoreStyle}>{showAll ? 'Hide' : `Show more ${actions.length - 5}`}</div>
          </div>
        </div>
      )}
    </Link>
  );
});
