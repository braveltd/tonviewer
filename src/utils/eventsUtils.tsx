import React from 'react';
import { AccountsApi, AccountEvents, NFTApi, NftItem } from 'tonapi-sdk-js';
import { apiConfigV2 } from 'tonviewer-web/helpers/api';
import { eventsFormatter, SortEventsT } from 'tonviewer-web/utils/eventsFormatter';

const apiConf = apiConfigV2(true);
const nftService = new NFTApi(apiConf);
const accountService = new AccountsApi(apiConf);

type NftResT = {
  name: string;
  img: string | null;
};

const nftItemCache: Map<string, NftItem> = new Map();

export const useNft = (nftAddress: string) => {
  const [nft, setNft] = React.useState<NftResT | null>(null);

  React.useEffect(() => {
    if (!!nft) {
      return;
    }
    const fetchInfo = async () => {
      try {
        if (nftItemCache.has(nftAddress)) {
          const nft = nftItemCache.get(nftAddress);
          setNft({
            name: nft.metadata?.name || 'NFT',
            img: nft.previews.length ? nft.previews.find(i => i.resolution === '100x100').url : null
          });
        } else {
          const res = await nftService.getNftItemByAddress({ accountId: nftAddress });
          nftItemCache.set(nftAddress, res);
          setNft({
            name: res.metadata?.name || 'NFT',
            img: res.previews.length ? res.previews.find(i => i.resolution === '100x100').url : null
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchInfo();
  }, [nftAddress, nft]);

  if (!nft) {
    return null;
  }

  return nft;
};

type TransactionsResT = {
  events: SortEventsT[];
  loadMore: () => void;
  hasMore: boolean;
};

export const useTransactions = (accountAddress: string, events: AccountEvents): TransactionsResT => {
  const [items, setItems] = React.useState(eventsFormatter(events.events));
  const [nextFrom, setNextFrom] = React.useState(events.nextFrom);

  const loadMore = React.useCallback(async () => {
    if (nextFrom === 0) {
      return;
    }
    try {
      const res = await accountService.getEventsByAccount({ accountId: accountAddress, limit: 50, beforeLt: nextFrom });
      setItems(prev => prev.concat(eventsFormatter(res.events)));
      setNextFrom(res.nextFrom);
    } catch (e) {
      console.log(e);
    }
  }, [items, nextFrom]);

  return {
    events: items,
    loadMore,
    hasMore: nextFrom !== 0
  };
};
