import * as Sentry from '@sentry/nextjs';
import { GetServerSidePropsContext } from 'next';
import { AccountsApi, JettonsApi } from 'tonapi-sdk-js';
import { apiConfigV2 } from '../../../helpers/api';
import { addressToBase64, serializeNestedObject } from '../../../helpers';
import { NoResultsPresenter } from '../../../components/core/no-results';
import { JettonDetailsPresenter, JettonDetailsPresenterProps } from '../../../components/features/jetton/details';

export default function JettonDetailsPage(props: JettonDetailsPresenterProps) {
  return !props.account ? <NoResultsPresenter /> : <JettonDetailsPresenter {...props} />;
}

export const getServerSideProps = async ({ params, res }: GetServerSidePropsContext) => {
  try {
    const { jetton, value: address } = params as { jetton: string; value: string };

    const apiConfig = apiConfigV2();

    const accountService = new AccountsApi(apiConfig);
    const jettonService = new JettonsApi(apiConfig);
    const accountInfo = await accountService.getAccount({ accountId: address });
    const jettonInfo = await jettonService.getJettonInfo({ accountId: jetton });
    const accountBalances = await accountService.getJettonsBalances({ accountId: address });
    const jettonBalance = accountBalances.balances.find(i => jetton === addressToBase64(i.jetton.address));

    const history = await accountService.getJettonsHistoryByID({ accountId: address, jettonId: jetton, limit: 1000 });

    return {
      props: serializeNestedObject({
        account: accountInfo,
        history: history.events,
        balance: jettonBalance,
        jetton: jettonInfo
      })
    };
  } catch (error) {
    console.error("Can't fetch jetton details");
    console.error(error);
    Sentry.captureException(error);
    return {
      props: {}
    };
  }
};
