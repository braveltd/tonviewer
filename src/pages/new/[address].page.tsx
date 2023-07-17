import TonWeb from 'tonweb';
import { GetServerSidePropsContext } from 'next';
import { AccountsApi, BlockchainApi, JettonsApi, NFTApi, StakingApi } from 'tonapi-sdk-js';
import { apiConfigV2 } from 'tonviewer-web/helpers/api';
import { AccountFragment, AccountFragmentProps } from 'tonviewer-web/fragments/account/AccountFragment';
import { serializeNestedObject } from 'tonviewer-web/helpers';
import { CacheService } from 'tonviewer-web/services/cache';
import { ExchangeService } from 'tonviewer-web/services/exchange';

interface AccountPageProps {
  data: AccountFragmentProps | null;
}

export default function AccountPage(props: AccountPageProps) {
  return <AccountFragment {...props.data} />;
}

export const getServerSideProps = async ({
  params
}: GetServerSidePropsContext): Promise<{ props: AccountPageProps }> => {
  const address = typeof params.address === 'string' ? params.address : null;

  if (!address || !TonWeb.Address.isValid(address)) {
    return {
      props: { data: null }
    };
  }

  const apiConf = apiConfigV2();

  const cacheService = new CacheService();
  const blockchainService = new BlockchainApi(apiConf);
  const accountService = new AccountsApi(apiConf);
  const stakingService = new StakingApi(apiConf);
  const jettonService = new JettonsApi(apiConf);
  const nftService = new NFTApi(apiConf);

  const exchangeService = new ExchangeService(cacheService);

  const account = await accountService.getAccount({ accountId: address });
  const accountRaw = await blockchainService.getRawAccount({ accountId: address });
  const accountEvents = await accountService.getEventsByAccount({ accountId: address, limit: 50 });
  const balanceUSD = await exchangeService.convertNanotonToUSD(account.balance);

  return {
    props: {
      data: {
        account: serializeNestedObject(account),
        events: serializeNestedObject(accountEvents),
        balanceUSD
      }
    }
  };
};
