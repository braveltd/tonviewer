import React from 'react';
import { css, cx } from '@linaria/core';
import { useRouter } from 'next/router';
import { AppRoutes } from 'tonviewer-web/helpers/routes';
import { Body2, TitleH3 } from 'tonviewer-web/utils/textStyles';
import { PriceChart } from 'tonviewer-web/components/Home/PriceChart';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
// import IcAccounts from 'tonviewer-web/assets/statistic/ic-accounts.svg';
// import IcTransaction from 'tonviewer-web/assets/statistic/ic-transaction.svg';
// import IcValidators from 'tonviewer-web/assets/statistic/ic-validators.svg';
import IcTelegram from 'tonviewer-web/assets/statistic/ic-telegram.svg';
import IcTon from 'tonviewer-web/assets/statistic/ic-ton.svg';
import IcRight from 'tonviewer-web/assets/icons/ic-chevron-right-16.svg';

export type StatisticProps = {
  dnsTon: string;
  dnsTelegram: string;
  // accounts: {
  //   count: number;
  //   perSecond: number;
  // };
  // transactions: {
  //   count: number;
  //   perSecond: number;
  // };
  // validators: string;
  price: {
    x: number;
    y: number;
  }[];
};

type StatisticItemProps = {
  title: string;
  value: string;
  className?: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

// type StatisticTimerItemProps = {
//   title: string;
//   count: number;
//   perSecond: number;
//   icon: ReactNode;
// };

const itemContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  gap: 48px;
  background: rgba(44, 126, 219, 0.04);
  border: 1px solid rgba(131, 137, 143, 0.16);
  border-radius: 12px;
  padding: 16px;
  flex: 1;

  &.pointer {
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

  &.short {
    max-width: calc(33.333% - 13px);
  }

  @media (max-width: 850px) {
    &,
    &.short {
      width: 100%;
      max-width: 100%;
    }
  }
`;

const itemTitle = cx(
  Body2,
  css`
    color: var(--textSecondary);
  `
);

const itemBottomContent = css`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const itemText = cx(
  TitleH3,
  css`
    color: var(--textPrimary);
  `
);

const itemIcon = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  opacity: 0.05;
`;

const iconMore = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StatisticItem = React.memo((props: StatisticItemProps) => {
  return (
    <div className={cx(itemContainer, props.className, !!props.onClick && 'pointer')} onClick={props.onClick}>
      <div className={itemTitle}>{props.title}</div>
      <div className={itemBottomContent}>
        <div className={itemText}>{props.value}</div>
        {!!props.onClick && (
          <div className={iconMore}>
            <div>Watch more</div>
            <UIcon icon={<IcRight />} />
          </div>
        )}
      </div>
      <div className={itemIcon}>{props.icon}</div>
    </div>
  );
});

// const StatisticTimerItem = memo((props: StatisticTimerItemProps) => {
//   const [val, setVal] = useState(props.count);
//
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setVal(prev => prev + 1);
//     }, 1000 / props.perSecond);
//     return () => clearInterval(timer);
//   }, [props.count]);
//
//   return <StatisticItem title={props.title} value={val.toLocaleString('en')} icon={props.icon} />;
// });

const statisticContainer = css`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 40px;
`;

const statisticSection = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const statisticItemsContent = css`
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 850px) {
    flex-direction: column;
  }
`;

const titleStyle = cx(
  TitleH3,
  css`
    color: var(--textPrimary);
  `
);

export const HomeStatistic = React.memo((props: StatisticProps) => {
  const router = useRouter();
  return (
    <div className={statisticContainer}>
      <div className={statisticSection}>
        {/*<div className={titleStyle}>Statistics</div>*/}
        <PriceChart data={props.price} />
        {/*<div className={statisticItemsContent}>*/}
        {/*  <StatisticTimerItem*/}
        {/*    title="Transactions"*/}
        {/*    count={props.transactions.count}*/}
        {/*    perSecond={props.transactions.perSecond}*/}
        {/*    icon={<IcTransaction />}*/}
        {/*  />*/}
        {/*  <StatisticTimerItem*/}
        {/*    title="Accounts"*/}
        {/*    count={props.accounts.count}*/}
        {/*    perSecond={props.accounts.perSecond}*/}
        {/*    icon={<IcAccounts />}*/}
        {/*  />*/}
        {/*  <StatisticItem title="Validators" value={props.validators} icon={<IcValidators />} />*/}
        {/*</div>*/}
      </div>
      <div className={statisticSection}>
        <div className={titleStyle}>DNS Auctions</div>
        <div className={statisticItemsContent}>
          <StatisticItem
            title="TON domains"
            value={props.dnsTon}
            className="short"
            onClick={() => router.push(AppRoutes.auctions('ton'))}
            icon={<IcTon />}
          />
          <StatisticItem
            title="Telegram usernames"
            value={props.dnsTelegram}
            className="short"
            onClick={() => router.push(AppRoutes.auctions('t.me'))}
            icon={<IcTelegram />}
          />
        </div>
      </div>
    </div>
  );
});
