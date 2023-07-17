import { addressToBase64 } from './index';
import { stringify } from 'query-string';
import { Address } from './address';

export const AppRoutes = {
  home: () => '/',
  notFound: () => '/404',
  error: () => '/500',
  accountDetails: (accountAddress: string) => {
    const base64Account = Address.isValid(accountAddress) ? addressToBase64(accountAddress) : accountAddress;
    return `/${base64Account}`;
  },
  accountNftList: (accountAddress: string) => {
    const base64Account = Address.isValid(accountAddress) ? addressToBase64(accountAddress) : accountAddress;
    return `/${base64Account}/nft`;
  },
  jettonDetails: (accountAddress: string, jettonAddress: string) => {
    const base64Account = Address.isValid(accountAddress) ? addressToBase64(accountAddress) : accountAddress;
    const base64Jetton = Address.isValid(jettonAddress) ? addressToBase64(jettonAddress) : jettonAddress;
    return `/${base64Account}/jetton/${base64Jetton}`;
  },
  auctions: (tld?: string) => {
    const query = stringify({ tld });
    return query ? `/auctions?${query}` : '/auctions';
  },
  domainBid: (domainName: string) => `/auctions/${domainName}/bids`,
  jettonResolver: (jettonAddress: string) => {
    const base64Jetton = Address.isValid(jettonAddress) ? addressToBase64(jettonAddress) : jettonAddress;
    return `/jetton/${base64Jetton}`;
  },
  nftResolver: (nftAddress: string) => {
    const base64Nft = Address.isValid(nftAddress) ? addressToBase64(nftAddress) : nftAddress;
    return `/nft/${base64Nft}`;
  },
  noResults: () => '/no-results',
  transactionDetails: (transactionAddress: string) => {
    // transactionAddress can't be base64
    return `/transaction/${transactionAddress}`;
  }
};
