import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';
import {
  AuctionBidsPagePresenter,
  AuctionBidsPagePresenterProps
} from '../../../components/features/auctions/bids/list';
import { NoResultsPresenter } from '../../../components/core/no-results';
import { serializeNestedObject } from '../../../helpers';
import { apiConfigV2 } from '../../../helpers/api';
import { AuctionService } from '../../../services/auction';
import LoggerService from '../../../services/logger';

const AuctionBidsPage: FC<AuctionBidsPagePresenterProps> = props => {
  return !props.bids ? <NoResultsPresenter /> : <AuctionBidsPagePresenter {...props} />;
};

export default AuctionBidsPage;

export async function getServerSideProps({ res, params }: GetServerSidePropsContext) {
  const domain = String(params.domain);
  const props = { domain } as AuctionBidsPagePresenterProps;
  const apiConfig = apiConfigV2();
  const auctionService = new AuctionService(apiConfig);

  try {
    const bids = await auctionService.getDomainBids(domain);
    props.bids = bids;
  } catch (error) {
    LoggerService.captureException(error);
    props.error = error.message;
    return { props: serializeNestedObject(props) };
  }

  return { props: serializeNestedObject(props) };
}
