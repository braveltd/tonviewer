import moment from 'moment';
import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { DomainBid } from 'tonapi-sdk-js';
import { convertNanoton } from '../../../helpers';
import { usePrettyAddress } from '../../../helpers/hooks';
import { prettifyPrice } from '../../../helpers/numbers';
import { AppRoutes } from '../../../helpers/routes';
import { Card } from '../../core/card';
import { Link } from '../../core/link';
import { Text } from '../../core/text';
import { GridAuctions } from './table-header';
import { css, cx } from '@linaria/core';
import { Copy } from '../../core/copy';

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  min-width: 20px;
`;

type TAuctionBidRowProps = {
  bid: DomainBid
  isTablet?: boolean
}

export const BidGrid = css`
  grid-template-columns: 120px 1fr 1fr !important;
  cursor: default !important;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr !important;
  }
`;

export const AuctionBidRow: FC<TAuctionBidRowProps> = ({ bid, isTablet = false }) => {
  const theme = useTheme();
  const address = usePrettyAddress(bid.bidder.address);
  const price = prettifyPrice(convertNanoton(bid.value));
  const date = moment(bid.txTime).format('DD.MM.yyyy, HH:mm:ss');
  const link = AppRoutes.accountDetails(bid.bidder.name || address);

  const handleRoute = (e) => {
    e.preventDefault();
    window.location.href = link;
    e.stopPropagation();
  };

  if (isTablet) {
    return (
      <div className={cx(GridAuctions, BidGrid)}>
        <Text className={'b2'}>
          {price} TON
        </Text>
          <Link href={link} onClick={(e) => handleRoute}>
              <Copy textToCopy={bid.bidder.name || address}>
                  <Text className={'l2-mono'} type={'history-address'}>
                      {bid.bidder.name || address}
                  </Text>
              </Copy>
          </Link>
      </div>
    );
  }

  return (
      <div className={cx(GridAuctions, BidGrid)}>
          <Text className={'b2'}>
              {price} TON
          </Text>
          <Text className={'b2'}>
              {date}
          </Text>
          <Link href={link} onClick={(e) => handleRoute}>
              <Copy textToCopy={bid.bidder.name || address}>
                  <Text className={'l2-mono'} type={'history-address'}>
                      {bid.bidder.name || address}
                  </Text>
              </Copy>
          </Link>
      </div>
  );
};

const AuctionCard = styled(Card)`
  padding: ${(props) => `${props.theme.spacing.medium}`};

  @media screen and (min-width: 768px) {
    padding: ${(props) => `${props.theme.spacing.medium} ${props.theme.spacing.extra}`};
  }
`;
