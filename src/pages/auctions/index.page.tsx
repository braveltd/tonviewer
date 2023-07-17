import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useAsyncFn, useMedia, useMethods, useSearchParam } from 'react-use';
import styled from 'styled-components';
import { Auction, DNSApi } from 'tonapi-sdk-js';
import { Layout } from '../../components/core/layout';
import { Text } from '../../components/core/text';
import orderBy from 'lodash/orderBy';
import { AuctionDomainRow, SkeletonAuctionDomainRow } from '../../components/features/auctions/domain';
import { createAuctionFilters, initAuctionFilters, TAuctionFiltersState, TLD_OPTIONS } from '../../hooks/auctions';
import { AuctionsHeader, GridRowsWrapper } from '../../components/features/auctions/table-header';
import { Option } from '../../types/common';
import { useRouter } from 'next/router';
import { useListenHistoryChange } from '../../hooks/use-listen-history';
import { apiConfigV2 } from 'src/helpers/api';
import { css, cx } from '@linaria/core';
import { AppRoutes } from '../../helpers/routes';
import { Loader } from '../../components/core/loader';

type TAuctionsPagePresenterProps = ReturnType<typeof createAuctionFilters> & {
  auctions?: Auction[]
  error?: Error
  filters: TAuctionFiltersState
  loading: boolean
  options: Option[]
}

const SHOW_CLS = 'show';

const ScrollToTopArrowBox = styled.div`
  align-items: center;
  background: ${(props) => props.theme.colors.background.card};
  border: ${(props) => props.theme.border};
  border-radius: 10px;
  cursor: pointer;
  display: none;
  height: 40px;
  justify-content: center;
  position: fixed;
  bottom: 32px;
  right: calc(100% / 2 - 1160px / 2 - 40px - 16px);
  width: 40px;

  &.${SHOW_CLS} {
    display: flex;
  }
`;

const ScrollToTopArrow = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const toggleButton = () => {
      if (window.scrollY > window.innerHeight && !ref.current?.classList.contains(SHOW_CLS)) {
        ref.current.classList.add(SHOW_CLS);
      }

      if (window.scrollY < window.innerHeight && ref.current?.classList.contains(SHOW_CLS)) {
        ref.current.classList.remove(SHOW_CLS);
      }
    };

    document.addEventListener('scroll', toggleButton);

    return () => document.removeEventListener('scroll', toggleButton);
  }, []);

  return (
    <ScrollToTopArrowBox ref={ref} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
      <span className={'icon-ic-arrow-up-16 icon'}></span>
    </ScrollToTopArrowBox>
  );
};

export const WrapperDNS = css`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
`;

export const SectionContainer = css`
  display: flex;
  gap: 20px;
  background-color: var(--backgroundCard);
  margin-bottom: 1px;
  padding: 0 24px;
  
  .section-item {
    padding-top: 17px;
    padding-bottom: 15px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    
    .loader {
      width: 24px;
      height: 24px;
    }
    
    span {
      color: var(--textSecondary);
      user-select: none;
      cursor: pointer;
    }
    
    .bid-title {
      color: var(--textPrimary) !important;
      cursor: default;
    }
    
    .bid-title-s {
      cursor: default;
    }
  }
  
  .bid-title-container {
    cursor: default;
  }
`;

export const SectionActive = css`
  border-bottom: 2px solid var(--textPrimary);
  span {
    color: var(--textPrimary) !important;
  }
`;

enum Tld {
  Ton = 'ton',
  Telegram = 't.me'
}

const AuctionsPagePresenter: FC<TAuctionsPagePresenterProps> = ({
  auctions,
  filters,
  loading,
  options,
  search,
  sort,
  updateTld
}) => {
  const isTablet = useMedia('(max-width: 768px)');
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(Tld.Ton);
  const tondnsClass = cx('section-item', activeSection === Tld.Ton && SectionActive);
  const telegramClass = cx('section-item', activeSection === Tld.Telegram && SectionActive);

  const handleClickSection = (sectionName: string) => {
    setActiveSection(activeSection);
    router.replace(AppRoutes.auctions(sectionName), undefined, { shallow: true });
  };

  useEffect(() => {
    const { tld }: any = router.query;
    if (tld) setActiveSection(tld);
  }, [router.query]);

  return (
    <Layout>
      <div className={WrapperDNS}>
        <div className={SectionContainer}>
          <div className={tondnsClass} onClick={() => handleClickSection(Tld.Ton)}>
            <Text className={'l1'}>
              TON DNS
            </Text>
            {(loading && activeSection === Tld.Ton && SectionActive) && (
                <Loader isTab className={'loader'} />
            )}
          </div>
          <div className={telegramClass} onClick={() => handleClickSection(Tld.Telegram)}>
            <Text className={'l1'}>
              Telegram usernames
            </Text>
            {(loading && activeSection === Tld.Telegram && SectionActive) && (
                <Loader isTab className={'loader'} />
            )}
          </div>
        </div>
        <AuctionsHeader
            updateTld={updateTld}
            orderBy={filters.orderBy}
            sort={sort}
            search={search}
            options={options}
            filters={filters}
        />
        <div className={GridRowsWrapper}>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonAuctionDomainRow
                      isTablet={isTablet}
                      key={`skeleton-domain-${idx}`}
                  />
            ))
            : auctions?.map((auction) => (
                  <AuctionDomainRow
                      key={`domain-${auction.domain}`}
                      auction={auction} isTablet={isTablet} />
            ))}
        </div>
        <ScrollToTopArrow />
      </div>
    </Layout>
  );
};

const getTldOptionByValue = (tld: string) => {
  return TLD_OPTIONS.find(({ value }) => value === tld) ?? initAuctionFilters.tld;
};

const AuctionsPageContainer = () => {
  const initTld = useSearchParam('tld');
  const router = useRouter();

  const [filters, methods] = useMethods(
    createAuctionFilters,
    {
      ...initAuctionFilters,
      tld: initTld ? getTldOptionByValue(initTld) : initAuctionFilters.tld
    }
  ) as [TAuctionFiltersState, ReturnType<typeof createAuctionFilters>];

  const [auctionsQuery, fetchAuctions] = useAsyncFn(async (tld: string) => {
    try {
      const apiConfV2: any = apiConfigV2(true);
      const auctionService = new DNSApi(apiConfV2);

      const response = tld
        ? await auctionService.getAllAuctions({ tld })
        : await auctionService.getAllAuctions();

      return response.data as Auction[];
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const tld = String(filters.tld?.value);
    fetchAuctions(tld);

    const url = {
      pathname: router.pathname,
      query: tld ? { tld } : {}
    };
    router.push(url, undefined, { shallow: true });
    // eslint-disable-next-line
  }, [fetchAuctions, filters.tld?.value]);

  // If user updates history (back, forward button)
  // We should also update results properly
  useListenHistoryChange((url, query) => {
    methods.updateTld(getTldOptionByValue(String(query.tld)));
  });

  const auctions = useMemo(() => {
    if (!auctionsQuery.value) return [];
    let data = auctionsQuery.value;

    if (filters.search) {
      const regex = new RegExp(encodeURIComponent(filters.search), 'i');
      data = data.filter((item) => regex.test(item.domain));
    }

    if (filters.orderBy) {
      data = orderBy(data, filters.orderBy.name, filters.orderBy.direction);
    }

    return data;
  }, [auctionsQuery.value, filters]);

  return (
    <AuctionsPagePresenter
      auctions={auctions}
      error={auctionsQuery.error}
      filters={filters}
      loading={auctionsQuery.loading}
      options={TLD_OPTIONS}
      {...methods}
    />
  );
};

export default AuctionsPageContainer;
