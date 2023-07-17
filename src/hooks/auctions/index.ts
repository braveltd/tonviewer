import { Auction } from 'tonapi-sdk-js';
import { Option } from '../../types/common';

export type TOrderBy<T extends string = string> = {
  direction: 'asc' | 'desc'
  name: T
}

export type TAuctionFiltersState = Partial<{
  tld: Option
  search: string
  orderBy: TOrderBy<keyof Auction>
}>

export const TLD_OPTIONS = [
  { label: 'All domains', value: '' },
  { label: 'Telegram domains', value: 't.me' },
  { label: 'TON domains', value: 'ton' }
];

export const initAuctionFilters: TAuctionFiltersState = {
  tld: TLD_OPTIONS[0],
  search: '',
  orderBy: {
    name: 'price',
    direction: 'desc'
  }
};

export const createAuctionFilters = (state: TAuctionFiltersState) => {
  return {
    updateTld (value: Option) {
      return {
        ...state,
        tld: value
      };
    },
    search (value: string): TAuctionFiltersState {
      return {
        ...state,
        search: value
      };
    },
    sort (orderBy: keyof Auction): TAuctionFiltersState {
      const sameName = state.orderBy?.name === orderBy;
      if (sameName) {
        return {
          ...state,
          orderBy: {
            name: orderBy,
            direction: state.orderBy?.direction === 'desc' ? 'asc' : 'desc'
          }
        };
      }
      return {
        ...state,
        orderBy: {
          name: orderBy,
          direction: 'asc'
        }
      };
    }
  };
};
