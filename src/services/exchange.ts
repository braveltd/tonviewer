import axios from 'axios';
import moment from 'moment';
import get from 'lodash/get';
import { CacheService } from './cache';
import LoggerService from './logger';

const ExchangeCacheKeys = {
  tonPriceUSD: 'tonPriceUSD'
};

export class ExchangeService {
  private readonly baseUrl: string = process.env.exchangeHost;

  constructor (private cacheService: CacheService) {}

  private _round (value: number | string, length = 2) {
    if (isNaN(+value)) return 0;
    return (
      Math.round((+value + Number.EPSILON) * Math.pow(10, length)) /
      Math.pow(10, length)
    );
  }

  private convertNanoton (value: number | string, round = true) {
    return round ? this._round(+value / Math.pow(10, 9)) : +value / Math.pow(10, 9);
  }

  public async convertNanotonToUSD (nanoton: number | string) {
    let tonPriceUSD = this.cacheService.get(ExchangeCacheKeys.tonPriceUSD);
    if (!tonPriceUSD) {
      const { USD, TON } = await this.getExchangePrices();
      tonPriceUSD = USD / TON;
      const ttl = moment().endOf('day').valueOf() - Date.now();
      this.cacheService.put(ExchangeCacheKeys.tonPriceUSD, tonPriceUSD, ttl);
    }
    return this._round(this.convertNanoton(nanoton) * tonPriceUSD);
  }

  public async getExchangePrices () {
    try {
      const response = await axios.get(this.baseUrl, { timeout: 5000 });
      const today = get(response, 'data.data.today', {});
      return {
        USD: today.USD,
        TON: today.TON
      };
    } catch (error) {
      LoggerService.captureException(error);
      return { USD: null, TON: null };
    }
  }
}
