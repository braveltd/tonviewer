import { FC } from 'react';
import { useMedia, useSearchParam } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { DomainBid } from 'tonapi-sdk-js';
import { Breadcrumbs } from '../../../index';
import { AuctionBidRow, BidGrid } from '../bid';
import { Column } from '../../../core/column';
import { Grid, GridItem } from '../../../core/grid';
import { Layout } from '../../../core/layout';
import { SecondaryText, Text, TitleH1 } from '../../../core/text';
import { AppRoutes } from '../../../../helpers/routes';
import { GridAuctions, GridRowsWrapper } from '../table-header';
import { cx } from '@linaria/core';
import { SectionContainer, WrapperDNS } from '../../../../pages/auctions/index.page';

export type AuctionBidsPagePresenterProps = {
  bids: DomainBid[]
  domain: string
  error?: Error
}

const AuctionBidHeaderBox = styled.div`
    background-color: ${(props) => props.theme.colors.background.main};
    padding: ${(props) => `${props.theme.spacing.small} ${props.theme.spacing.extra}`};
    position: sticky;
    top: 0;
  `;

export const AuctionBidHeader = ({ isTablet }) => {
  const theme = useTheme();

  return (
    <div className={cx(GridAuctions, BidGrid)} style={{ marginBottom: '4px' }}>
        <SecondaryText className={'b2'}>Bid</SecondaryText>
        {!isTablet && <SecondaryText className={'b2'}>Date</SecondaryText>}
        <SecondaryText className={'b2'}>From wallet</SecondaryText>
    </div>
  );
};

export const AuctionBidsPagePresenter: FC<AuctionBidsPagePresenterProps> = ({ bids, domain }) => {
  const theme = useTheme();
  const isTablet = useMedia('(max-width: 768px)');
  const tld = useSearchParam('tld');

  return (
    <Layout>
      <Breadcrumbs
          items={[
            { name: 'Auctions', link: AppRoutes.auctions(tld) },
            { name: domain }
          ]}
      />
      <div className={WrapperDNS}>
        <div className={SectionContainer}>
          <div className={'section-item bid-title-container'}>
            <Text className={'l1 bid-title'}>
              Bid history
            </Text>
            <SecondaryText className={'l1 bid-title-s'}>
                {domain}
            </SecondaryText>
          </div>
        </div>
        <Column>
          <AuctionBidHeader isTablet={isTablet} />
          <div className={GridRowsWrapper}>
            {bids.map((bid) => (
                <AuctionBidRow
                    key={`bid-${domain}-${bid.txTime}`}
                    bid={bid}
                    isTablet={isTablet}
                />
            ))}
          </div>
        </Column>
      </div>
    </Layout>
  );
};
