import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { Auction } from 'tonapi-sdk-js';
import { Card } from '../../core/card';
import { Grid, GridItem } from '../../core/grid';
import { Text } from '../../core/text';
import { prettifyPrice } from '../../../helpers/numbers';
import { convertNanoton } from '../../../helpers';
import { usePrettyAddress } from '../../../helpers/hooks';
import { timeDiff } from '../../../helpers/time';
import moment from 'moment';
import { Paragraph as SkeletonParagraph } from '@nejcm/react-skeleton';
import { Column } from '../../core/column';
import { useMedia, useSearchParam } from 'react-use';
import Link from 'next/link';
import { Row } from '../../core/row';
import { AppRoutes } from '../../../helpers/routes';
import { Truncate } from '../../core/truncate';
import { useIsMobile } from '@farfetch/react-context-responsive';
import { ColumnAuction, GridAuctions } from './table-header';
import { css, cx } from '@linaria/core';
import { useRouter } from 'next/router';

type TAuctionRowProps = {
  auction: Auction
  isTablet?: boolean
}

export const SkeletonAuctionDomainRow = ({ isTablet = false }) => {
  const theme = useTheme();
  const isMobile = useMedia('(max-width: 768px)');

  if (isMobile) {
    return (
          <div className={GridAuctions}>
              <GridItem>
                  <SkeletonParagraph lines={1} />
              </GridItem>
              <GridItem>
                  <SkeletonParagraph lines={1} />
              </GridItem>
              <GridItem>
                  <SkeletonParagraph lines={1} />
              </GridItem>
              {/* <GridItem> */}
              {/*    <SkeletonParagraph lines={1} /> */}
              {/* </GridItem> */}
              {/* <GridItem> */}
              {/*    <SkeletonParagraph lines={1} /> */}
              {/* </GridItem> */}
          </div>
    );
  }

  if (isTablet) {
    return (
        <div className={GridAuctions}>
            <GridItem>
                <SkeletonParagraph lines={1} />
            </GridItem>
            <GridItem>
                <SkeletonParagraph lines={1} />
            </GridItem>
            <GridItem>
                <SkeletonParagraph lines={1} />
            </GridItem>
            {/* <GridItem> */}
            {/*    <SkeletonParagraph lines={1} /> */}
            {/* </GridItem> */}
            <GridItem>
                <SkeletonParagraph lines={1} />
            </GridItem>
        </div>
    );
  }

  return (
      <div className={GridAuctions}>
          <GridItem>
              <SkeletonParagraph lines={1} />
          </GridItem>
          <GridItem>
              <SkeletonParagraph lines={1} />
          </GridItem>
          <GridItem>
              <SkeletonParagraph lines={1} />
          </GridItem>
          {/* <GridItem> */}
          {/*    <SkeletonParagraph lines={1} /> */}
          {/* </GridItem> */}
          <GridItem>
              <SkeletonParagraph lines={1} />
          </GridItem>
      </div>
  );
};

const HorizontalDivider = styled.div`
  border-bottom: ${(props) => props.theme.border};
  margin: ${(props) => `${props.theme.spacing.medium} 0`};
  width: 100%;
`;

const tmeRegex = /\.t\.me$/;

const isTelegramDomain = (domain: string) => {
  return tmeRegex.test(domain);
};

const getTelegramRootDomain = (domain: string) => {
  return domain.replace(tmeRegex, '');
};

const TextWrapperAuctions = css`
  display: table;
  table-layout: fixed;
  width: 100%;
  
  span {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const DomainColumn = ({ domain }) => {
  const shouldShowTelegramDomain = isTelegramDomain(domain);
  const { isMobile } = useIsMobile();
  const tld = useSearchParam('tld');
  const domainBidsRoute = AppRoutes.domainBid(domain);
  const href = tld ? `${domainBidsRoute}?tld=${tld}` : domainBidsRoute;

  if (shouldShowTelegramDomain) {
    const rootDomain = getTelegramRootDomain(domain);
    const nickname = `@${rootDomain}`;
    // const link = `t.me/${rootDomain}`;

    return (
      <Link href={href} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={TextWrapperAuctions}>
              <Text className={'l2'}>
                  {nickname}
              </Text>
          </div>
        {/* <Truncate text={link} textElement={SecondaryText} length={isMobile ? 25 : 19} /> */}
      </Link>
    );
  }

  return (
    <Link href={href}>
        <div className={TextWrapperAuctions}>
            <Text className={'l2'}>
                {domain}
            </Text>
        </div>
    </Link>
  );
};

export const AuctionDomainRow: FC<TAuctionRowProps> = ({ auction, isTablet = false }) => {
  const isDesktop = useMedia('(min-width: 1024px)');
  const theme = useTheme();
  const { bids, domain } = auction;
  const router = useRouter();
  const owner = usePrettyAddress(auction.owner, { coef: isDesktop ? 0 : 60, fullOnDesktop: false });
  const price = prettifyPrice(convertNanoton(auction.price));
  const endDate = timeDiff(moment(), moment(auction.date * 1000));
  // const endSoon = moment().add(3, 'hour') > moment(auction.date);
  const tld = useSearchParam('tld');
  const domainBidsRoute = AppRoutes.domainBid(domain);
  const href = tld ? `${domainBidsRoute}?tld=${tld}` : domainBidsRoute;

  const handleRoute = (e) => {
    e.preventDefault();
    router.push(href);
    e.stopPropagation();
  };

  if (isTablet) {
    return (
        <Link href={href} onClick={(e) => handleRoute(e)}>
            <div className={GridAuctions}>
                <div className={ColumnAuction}>
                    <DomainColumn domain={domain} />
                </div>
                <div className={ColumnAuction}>
                    <Text className={'b2'}>
                        in {endDate}
                    </Text>
                </div>
                <div className={cx(ColumnAuction, 'end')}>
                    <Text className={'b2'}>
                        {price} {isDesktop ? 'TON' : ''}
                    </Text>
                </div>
            </div>
        </Link>
    );
  }

  const shouldShowTelegramDomain = isTelegramDomain(domain);

  return (
        <Link href={href} onClick={(e) => handleRoute(e)}>
          <div className={GridAuctions}>
            <div className={ColumnAuction}>
              <DomainColumn domain={domain} />
            </div>
            <div className={ColumnAuction}>
                <Text className={'b2'}>
                    in {endDate}
                </Text>
            </div>
            <div className={cx(ColumnAuction, 'end')}>
                <Text className={'b2'}>
                    <Link href={href}>
                        {bids}  {
                        // isDesktop ? (bids > 1 ? 'bids' : 'bid') : ''
                    }
                    </Link>
                </Text>
            </div>
            <div className={cx(ColumnAuction, 'end')}>
                <Text className={'b2'}>
                    {price} {isDesktop ? 'TON' : ''}
                </Text>
            </div>
          </div>
      </Link>
  );
};

const AuctionCard = styled(Card)`
  padding: ${(props) => `${props.theme.spacing.medium}`};

  @media screen and (min-width: 768px) {
    padding: ${(props) => `${props.theme.spacing.medium} ${props.theme.spacing.extra}`};
  }
`;
