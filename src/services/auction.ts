import { DNSApi, Configuration, ConfigurationParameters } from 'tonapi-sdk-js';

export class AuctionService {
  private _api: DNSApi;

  constructor(configParams: ConfigurationParameters) {
    const configuration = new Configuration(configParams);
    this._api = new DNSApi(configuration);
  }

  public getDomainBids(domainName: string) {
    console.log(`Getting domain bids for ${domainName}`);
    return this._api.getDomainBids({ domainName }).then(response => {
      return response.data.map(bid => ({
        ...bid,
        txTime: bid.txTime * 1000
      }));
    });
  }

  public getDnsAuctions(tld?: string) {
    return this._api.getAllAuctions({ tld }).then(response => {
      return {
        ...response,
        data: response.data
          .map(auction => ({
            ...auction,
            date: auction.date * 1000
          }))
          .sort((a, b) => (b.price > a.price ? 1 : b.price < a.price ? -1 : 0))
      };
    });
  }
}
