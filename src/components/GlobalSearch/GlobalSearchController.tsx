import React from 'react';
import { AccountsApi } from 'tonapi-sdk-js';
import { useRouter } from 'next/router';
import { useDebounce } from 'tonviewer-web/hooks/useDebounce';
import { useShortcuts } from 'tonviewer-web/hooks/useShortcuts';
import { useLocalStorage } from 'tonviewer-web/hooks/useLocalStorage';
import { apiConfigV2 } from 'tonviewer-web/helpers/api';
import { AppRoutes } from 'tonviewer-web/helpers/routes';
import { replaceString } from './formatter';

export type HitItem = {
  address: string;
  name: string;
};

const apiConf = apiConfigV2(true);
const accountService = new AccountsApi(apiConf);

export const useGlobalSearchController = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [isFocused, setIsFocused] = React.useState(false);
  const [val, setVal] = React.useState('');
  const [hitsArr, setHitsArr] = React.useState<HitItem[]>([]);
  const [storeItems, setStoreItems] = useLocalStorage<HitItem[]>('history-search-v3', []);

  const debounceStr = useDebounce(val);

  const reqHits = debounceStr.trim().length > 2;

  const handleChange = React.useCallback((str: string) => {
    try {
      const url = new URL(str);
      if (url.pathname) {
        const split = url.pathname.split('/');
        const address = split[split.length - 1];
        setVal(address);
      }
    } catch (e) {
      setVal(str);
    }
  }, []);

  const getHits = React.useCallback(async (str: string) => {
    try {
      const response = await accountService.getSearchAccounts({ name: str.trim().toLowerCase() });
      const data = response?.addresses || [];
      setHitsArr(data);
      setActiveIndex(0);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  React.useEffect(() => {
    if (reqHits) {
      getHits(debounceStr);
    } else {
      setHitsArr([]);
    }
  }, [reqHits, debounceStr, getHits]);

  React.useEffect(() => {
    if (router.route.includes('jetton')) {
      setVal(router.query.jetton ? String(router.query.jetton) : '');
    } else {
      setVal(router.query.value ? String(router.query.value) : '');
    }
  }, [router]);

  const sortedHits = React.useMemo(() => {
    return hitsArr.map(i => ({ name: i.name, address: replaceString(i.address).value }));
  }, [hitsArr]);

  const handleHitClick = React.useCallback(
    async (item: HitItem) => {
      const newStore = [item, ...storeItems.filter(i => item.address !== i.address)].slice(0, 4);
      setStoreItems(newStore);
      setIsFocused(false);

      const parse = replaceString(item.address);

      if (parse.type === 'transaction') {
        await router.push(AppRoutes.transactionDetails(parse.value));
      } else {
        await router.push(AppRoutes.accountDetails(parse.value));
      }
    },
    [setStoreItems, storeItems]
  );

  const handleHitDelete = React.useCallback(
    (item: HitItem) => {
      const newStore = storeItems.filter(i => item.address !== i.address);
      setStoreItems(newStore);
    },
    [setStoreItems, storeItems]
  );

  const handleSearch = React.useCallback(() => {
    if (activeIndex !== -1) {
      const item = hits[activeIndex];
      handleHitClick(item);
    } else {
      const str = val.trim();
      if (!str) {
        return;
      }
      handleHitClick({
        address: str,
        name: ''
      });
    }
  }, [activeIndex, val]);

  const hits = reqHits ? sortedHits : storeItems;

  useShortcuts(
    [
      {
        keys: ['Enter'],
        callback: handleSearch
      },
      {
        keys: ['Tab'],
        callback: () => {
          const hasItem = !!hits.length;
          if (hasItem) {
            handleHitClick(hits[0]);
          }
        }
      },
      {
        keys: ['ArrowUp'],
        callback: () => {
          if (activeIndex > -1) {
            setActiveIndex(activeIndex - 1);
          } else {
            setActiveIndex(hits.length - 1);
          }
        }
      },
      {
        keys: ['ArrowDown'],
        callback: () => {
          if (activeIndex < hits.length - 1) {
            setActiveIndex(activeIndex + 1);
          } else {
            setActiveIndex(-1);
          }
        }
      }
    ],
    [val, hits, activeIndex]
  );

  return {
    activeIndex,
    setActiveIndex,
    isFocused,
    setIsFocused,
    val,
    handleChange,
    hits,
    handleHitClick,
    handleHitDelete,
    reqHits,
    handleSearch
  };
};
