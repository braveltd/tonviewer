import { useRouter } from 'next/router';
import { parse } from 'query-string';
import { useEffect } from 'react';

type ListenHistoryCallback = (url: string, query: Record<string, unknown>) => void

export const useListenHistoryChange = (callback: ListenHistoryCallback) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const urlPathRegex = /^([^?]+)/;
      const query = parse(url.replace(urlPathRegex, ''));
      callback(url, query);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line
  }, [callback]);
};
