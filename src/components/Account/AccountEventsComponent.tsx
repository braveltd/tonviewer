import React from 'react';
import { css, cx } from '@linaria/core';
import { AccountEvent, AccountEvents } from 'tonapi-sdk-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from 'tonviewer-web/components/core/loader';
import { AccountTransactionComponent } from 'tonviewer-web/components/Account/AccountTransactionComponent';
import { useTransactions } from 'tonviewer-web/utils/eventsUtils';
import { eventsFormatter } from 'tonviewer-web/utils/eventsFormatter';
import { Label1 } from 'tonviewer-web/utils/textStyles';

const eventsContainer = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-self: stretch;
  gap: 4px;
`;

const headerContainer = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const titleStyle = cx(
  Label1,
  css`
    padding: 19px 24px;
    border-radius: 16px 16px 0 0;
    background-color: var(--backgroundContent);
    color: var(--textPrimary);

    &.empty {
      text-align: center;
      border-radius: 0 0 16px 16px;
    }
  `
);

const EventsHeader = React.memo((props: { isEmpty: boolean }) => {
  return (
    <div className={headerContainer}>
      <div className={titleStyle}>Transaction history</div>
    </div>
  );
});

const eventsContent = css`
  display: flex;
  flex-direction: column;
  align-self: stretch;

  & .infinite-scroll-component__outerdiv,
  & .infinite-scroll-component {
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }

  & .infinite-scroll-component {
    gap: 4px;

    & > a:last-child {
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }
`;

interface AccountEventsComponentProps {
  data: AccountEvents;
  accountAddress: string;
}

export const AccountEventsComponent = React.memo((props: AccountEventsComponentProps) => {
  const { events, hasMore, loadMore } = useTransactions(props.accountAddress, props.data);
  return (
    <div className={eventsContainer}>
      <EventsHeader isEmpty={!events.length} />
      {!!events.length ? (
        <div className={eventsContent}>
          <InfiniteScroll dataLength={events.length} next={loadMore} hasMore={hasMore} loader={<Loader />}>
            {events.map((i, j) => (
              <AccountTransactionComponent key={i.lt + j} transaction={i} />
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className={cx(titleStyle, 'empty')}>Transactions not found</div>
      )}
    </div>
  );
});

export const JettonEventsComponent = React.memo((props: { events: AccountEvent[] }) => {
  const events = eventsFormatter(props.events);
  return (
    <div className={eventsContainer}>
      <EventsHeader isEmpty={!events.length} />
      {!!events.length ? (
        <div className={eventsContent}>
          <InfiniteScroll dataLength={events.length} next={() => null} hasMore={false} loader={<Loader />}>
            {events.map((i, j) => (
              <AccountTransactionComponent key={i.lt + j} transaction={i} />
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className={cx(titleStyle, 'empty')}>Transactions not found</div>
      )}
    </div>
  );
});
