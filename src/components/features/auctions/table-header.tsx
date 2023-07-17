import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { Auction } from 'tonapi-sdk-js';
import { SecondaryText, Text } from '../../core/text';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { createAuctionFilters, TOrderBy } from '../../../hooks/auctions';
import { useMedia } from 'react-use';
import { css, cx } from '@linaria/core';

const HeaderText = styled(Text)`
  cursor: pointer;
  font-size: 14px;
`;

type TAuctionsHeaderProps = {
  filters: any
  updateTld: any
  options: any
  search: any
  sort: ReturnType<typeof createAuctionFilters>['sort']
  orderBy: TOrderBy<keyof Auction>
}

type TSortIconProps = {
  orderBy?: TOrderBy<keyof Auction>
  name: keyof Auction
}

const SortIcon: FC<TSortIconProps> = ({ orderBy, name }) => {
  const theme = useTheme();

  if (!orderBy || orderBy.name !== name) return null;

  return orderBy.direction === 'asc'
    ? <FaSortUp color={theme.colors.text.secondary} size='12px' />
    : <FaSortDown color={theme.colors.text.secondary} size='12px' />;
};

export const GridAuctions = css`
  display: grid;
  grid-template-columns: 1fr 120px 120px minmax(100px, 160px);
  grid-template-rows: 16px;
  padding: 12px 24px;
  background-color: var(--backgroundCard);
  column-gap: 20px;
  box-sizing: border-box;
  cursor: pointer;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 128px 1fr 1fr;
  }
  
  .skeleton {
    height: 17px;
    width: 100%;
    
    .s-paragraph, .s-loader {
      height: 17px;
    }
  }

  .end {
    justify-content: flex-end;
  }
`;

export const GridRowsWrapper = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ColumnAuction = css`
  display: flex;
  align-items: center;

  span {
    cursor: pointer;
  }
`;

const Separator = css`
  border-bottom: 1px solid var(--separatorCommon);
`;

export const AuctionsHeader: FC<TAuctionsHeaderProps> = ({ filters, orderBy, sort, updateTld, search, options }) => {
  const isTablet = useMedia('(max-width: 768px)');
  const theme = useTheme();
  const filterTemplateColumns = isTablet ? 'initial' : '190px 280px';

  if (isTablet) {
    return (
            <div className={cx(GridAuctions)} style={{ marginBottom: '4px' }}>
                <div className={ColumnAuction}>
                    <HeaderText onClick={() => sort('domain')}>
                        <SecondaryText className={'b2'}>
                            Domain <SortIcon orderBy={orderBy} name='domain' />
                        </SecondaryText>
                    </HeaderText>
                </div>
                <div className={ColumnAuction}>
                    <HeaderText onClick={() => sort('date')}>
                        <SecondaryText className={'b2'}>
                            Auction end <SortIcon orderBy={orderBy} name='date' />
                        </SecondaryText>
                    </HeaderText>
                </div>
                <div className={cx(ColumnAuction, 'end')}>
                    <HeaderText onClick={() => sort('price')}>
                        <SecondaryText className={'b2'}>
                            Price <SortIcon orderBy={orderBy} name='price' />
                        </SecondaryText>
                    </HeaderText>
                </div>
            </div>
    );
  }

  return (
      <div className={cx(GridAuctions)} style={{ marginBottom: '4px' }}>
        <div className={ColumnAuction}>
          <HeaderText onClick={() => sort('domain')}>
            <SecondaryText className={'b2'}>
                Domain <SortIcon orderBy={orderBy} name='domain' />
            </SecondaryText>
          </HeaderText>
        </div>
        {/* <GridItem> */}
        {/*  <HeaderText style={{ cursor: 'initial' }}> */}
        {/*    <SecondaryText className={'b2'}> */}
        {/*        Address */}
        {/*    </SecondaryText> */}
        {/*  </HeaderText> */}
        {/* </GridItem> */}
        <div className={ColumnAuction}>
          <HeaderText onClick={() => sort('date')}>
            <SecondaryText className={'b2'}>
                Auction end <SortIcon orderBy={orderBy} name='date' />
            </SecondaryText>
          </HeaderText>
        </div>
        <div className={cx(ColumnAuction, 'end')}>
          <HeaderText onClick={() => sort('bids')}>
              <SecondaryText className={'b2'}>
                  Bids <SortIcon orderBy={orderBy} name='bids' />
              </SecondaryText>
          </HeaderText>
        </div>
        <div className={cx(ColumnAuction, 'end')}>
            <HeaderText onClick={() => sort('price')}>
              <SecondaryText className={'b2'}>
                  Price <SortIcon orderBy={orderBy} name='price' />
              </SecondaryText>
          </HeaderText>
        </div>
      </div>
  );
};
