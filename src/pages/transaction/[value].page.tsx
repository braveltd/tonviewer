import { serializeNestedObject } from '../../helpers';
import LoggerService from '../../services/logger';
import { NoResultsPresenter } from '../../components/core/no-results';
import { TransactionDetailsContainer } from '../../components/features/transactions/details';
import { EventsApi, TracesApi } from 'tonapi-sdk-js';
import { apiConfigV2 } from '../../helpers/api';

export default function Transaction({ event, trace, error }) {
  return error ? <NoResultsPresenter /> : <TransactionDetailsContainer event={event} trace={trace} />;
}

export const getServerSideProps = async ({ params, res }) => {
  const { value } = params;
  const props = {
    value
  } as any;

  const apiConf = apiConfigV2();

  try {
    const eventsApi = new EventsApi(apiConf);
    const traceApi = new TracesApi(apiConf);

    props.event = await eventsApi.getEvent({ eventId: value });
    props.trace = await traceApi.getTrace({ traceId: value });
  } catch (error) {
    LoggerService.captureException(error);
    props.error = error.message;
    console.log(error?.response);
  }

  return { props: serializeNestedObject(props) };
};
