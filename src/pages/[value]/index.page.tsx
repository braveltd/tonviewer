import { FC } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AccountsApi, ActionTypeEnum, BlockchainApi, DNSApi, JettonsApi, NFTApi, StakingApi } from 'tonapi-sdk-js';
import { serializeNestedObject } from '../../helpers';
import { ExchangeService } from '../../services/exchange';
import { CacheService } from '../../services/cache';
import docsAsm from '../../../public/disasm.json';
import { Address } from '../../helpers/address';
import { isDomain } from '../../helpers/isDomain';
import { NoResultsPresenter } from '../../components/core/no-results';
import { getSettledErrorReason, getSettledValue } from '../../helpers/promise';
import { AccountDetailsContainer, AccountPageProps, JettonType } from '../../components/features/accounts/details';
import { GetServerSidePropsContext } from 'next';
import LoggerService from '../../services/logger';

import { AccountInterfaces, hasInterface } from '../../types/common';
import { apiConfigV2 } from '../../helpers/api';

const AccountPage: FC<AccountPageProps> = props => {
  return !props.account ? <NoResultsPresenter /> : <AccountDetailsContainer {...props} />;
};

export default AccountPage;

export const getServerSideProps = async ({ params, res, req }: GetServerSidePropsContext) => {
  const { value } = params;
  let address = String(value);
  const apiConf = apiConfigV2();

  if (!Address.isValid(address)) {
    const domain = isDomain(address) ? address.toLocaleLowerCase() : `${address}.ton`;
    const dnsService = new DNSApi(apiConf);
    const dnsname = { domainName: domain };
    try {
      const resolved = await dnsService.dnsResolve(dnsname);
      address = resolved.wallet.address;
    } catch (error) {
      console.log(error);
      LoggerService.captureException(error);
      address = domain;
      // try {
      //   // TODO изменить функцию тут
      //   // const info = await dnsService.getDomainBids(dnsname, reqHeders);
      //   // address = info.nftItem.address;
      // } catch (error) {
      //   console.log(error);
      //   LoggerService.captureException(error);
      //   address = domain;
      // }
    }
  }

  const accountConf = { accountId: address };
  const cacheService = new CacheService();
  const blockchainService = new BlockchainApi(apiConf);
  const accountService = new AccountsApi(apiConf);
  const stakingService = new StakingApi(apiConf);
  const jettonService = new JettonsApi(apiConf);
  const nftService = new NFTApi(apiConf);

  const exchangeService = new ExchangeService(cacheService);

  const [accountResponse, blockchainResponse, balancesResponse, nftsResponse, transactionsResponse]: any =
    await Promise.allSettled([
      accountService.getAccount(accountConf),
      blockchainService.getRawAccount(accountConf),
      accountService.getJettonsBalances(accountConf),
      accountService.getNftItemsByOwner(accountConf),
      accountService.getEventsByAccount({ ...accountConf, limit: 50 })
    ]);

  const errors: any = {
    account: getSettledErrorReason(accountResponse),
    blockchain: getSettledErrorReason(blockchainResponse),
    balance: getSettledErrorReason(balancesResponse),
    nfts: getSettledErrorReason(nftsResponse),
    transactions: getSettledErrorReason(transactionsResponse)
  };

  const account: any = getSettledValue(accountResponse);
  const blockchain: any = getSettledValue(blockchainResponse);
  const transactions = getSettledValue(transactionsResponse);
  const nfts = getSettledValue(nftsResponse)?.nftItems ?? [];

  const props: Partial<any> = {
    address,
    transactions,
    nfts,
    account,
    blockchain,
    interfaces: account.interfaces
  };

  const balances = getSettledValue(balancesResponse) ?? [];
  props.jettons = balances?.balances as JettonType[];

  const isStakingTF = hasInterface(account, AccountInterfaces.StakingTF);
  const isStakingW = hasInterface(account, AccountInterfaces.StakingW);

  if (isStakingTF || isStakingW) {
    try {
      props.naminators = await stakingService.stakingPoolInfo(accountConf);
    } catch (error) {
      console.log(error);
      errors.tonPriceUSD = error?.message;
      Sentry.captureException(error);
    }
  }

  if (hasInterface(account, AccountInterfaces.JettonMaster)) {
    try {
      props.jettonDetails = await jettonService.getJettonInfo(accountConf);
    } catch (error) {
      console.log(error);
      errors.jettonDetails = error?.message;
      Sentry.captureException(error);
    }
  }

  // TODO: Спросить почему приходит 500 Error
  // if (hasInterface(account, AccountInterfaces.NftCollection)) {
  //   try {
  //     // const collection = await nftService.getNftCollection(accountConf, reqHeders);
  //     // const nfts = await nftService(
  //     //   collection.owner?.address,
  //     //   collection.address,
  //     //   NFT_PREVIEW_COUNT + 1,
  //     //   0
  //     // );
  //     // console.log('collection', collection || 'f');
  //     // const slicedNfts = slice(nfts, 0, NFT_PREVIEW_COUNT);
  //     // props.nftCollectionDetails = collection;
  //     // props.nfts = slicedNfts;
  //     // props.hasMoreNfts = nfts.length > slicedNfts?.length;
  //   } catch (error) {
  //     console.log(error);
  //     errors.nfts = error?.message;
  //     Sentry.captureException(error);
  //   }
  // }

  const isNftEditable = hasInterface(account, AccountInterfaces.NftEditable);
  const isNftItem = hasInterface(account, AccountInterfaces.NftItem);

  if (isNftEditable || isNftItem) {
    try {
      const response = await nftService.getNftItemsByAddresses({
        getAccountsRequest: { accountIds: [account.address] }
      });

      props.nftDetails = response?.nftItems[0];
    } catch (error) {
      console.log(error);
      errors.nftDetails = error?.message;
      Sentry.captureException(error);
    }
  }

  try {
    props.tonPriceUSD = await exchangeService.convertNanotonToUSD(getSettledValue(accountResponse).balance);
  } catch (error) {
    console.log(error);
    errors.tonPriceUSD = error?.message;
    Sentry.captureException(error);
  }

  props.doscAsm = docsAsm;
  props.errors = errors;

  return { props: serializeNestedObject(props) };
};
