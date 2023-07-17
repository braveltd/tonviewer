import cacheData from 'memory-cache';
import { apiConfigV2 } from 'tonviewer-web/helpers/api';
import { DNSApi } from 'tonapi-sdk-js';
import { StatisticProps } from 'tonviewer-web/components/Home/Statistic';
import { runAsync } from 'tonviewer-web/utils/async';

const key = 'home-statistic';

interface Wallets {
  start: number;
  grow_per_second: number;
  current_supply: number;
  current: number;
  percentOfTotalCreatedWalletsLastYear: number;
}

interface Transactions {
  start: number;
  grow_per_second: number;
  current: number;
}

interface Validators {
  current_count: string;
  current_stake: number;
}

interface StatsT {
  status: string;
  wallets: Wallets;
  transactions: Transactions;
  validators: Validators;
}

interface PriceT {
  success: boolean;
  data: {
    x: number;
    y: number;
  }[];
}

type StatisticT = {
  data: StatisticProps;
  lastUpdate: number;
};

async function fetchStatistic(): Promise<StatisticT> {
  const apiConfV2: any = apiConfigV2();
  const dnsServices = new DNSApi(apiConfV2);

  const [ton, telegram, tonPrice] = await Promise.all([
    dnsServices.getAllAuctions({ tld: 'ton' }),
    dnsServices.getAllAuctions({ tld: 't.me' }),
    fetch('https://api.tonkeeper.com/stock/chart-new?period=1Y')
  ]);

  const arrayTon = ton.data || [];
  const arrayTelegram = telegram.data || [];
  const priceRes: PriceT = await tonPrice.json();

  return {
    lastUpdate: new Date().getTime(),
    data: {
      dnsTon: arrayTon.length.toString(),
      dnsTelegram: arrayTelegram.length.toString(),
      // accounts: {
      //   count: statsRes.wallets.current,
      //   perSecond: statsRes.wallets.grow_per_second
      // },
      // transactions: {
      //   count: statsRes.transactions.current,
      //   perSecond: statsRes.transactions.grow_per_second
      // },
      // validators: statsRes.validators.current_count,
      price: priceRes.data
    }
  };
}

export async function getHomeStats(): Promise<StatisticProps> {
  const value: StatisticT | null = cacheData.get(key);
  const timeNow = new Date().getTime();
  if (value) {
    if (value.lastUpdate + 1000 * 60 * 10 < timeNow) {
      runAsync(async () => {
        const res = await fetchStatistic();
        cacheData.put(key, res);
      });
    }
    return value.data;
  } else {
    const res = await fetchStatistic();
    cacheData.put(key, res);
    return res.data;
  }
}
