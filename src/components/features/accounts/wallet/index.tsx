/* eslint-disable max-len */
/* eslint-disable camelcase */
import styled, { useTheme } from 'styled-components';
import {
  Avatar,
  Tooltip
} from '../../../index';
import { useEffect, useState } from 'react';
import { HintIcon } from '../../../core/icons';
import { SecondaryText, Subtitle, Text } from '../../../core/text';
import { AccountsApi } from 'tonapi-sdk-js';
import { AccountSection } from '../details';
import { useMedia } from 'react-use';
import { addressToBase64, formatAddress } from '../../../../helpers';
import { Copy } from '../../../core/copy';
import { Truncate } from '../../../core/truncate';
import { apiConfigV2 } from '../../../../helpers/api';
import ContentLoader from 'react-content-loader';
import Link from 'next/link';
import Fade from 'react-reveal/Fade';
import { prettifyPrice } from '../../../../helpers/numbers';

const AmountCurrency = styled(Subtitle)`
  align-self: flex-end;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 2px;

  @media (max-width: 578px) {
    align-self: flex-start;
  }
`;

export const MobileQrWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

// const Comment = styled.div`
//   font-weight: 600;
//   font-size: 16px;
//   display: flex;
//   gap: 4px;
//   line-height: 24px;
// `;
//
// const QRDesktop = styled.div`
//   display: flex;
//   flex: 1;
//   align-items: center;
//   justify-content: flex-end;
//
//   @media (max-width: 578px) {
//     display: none;
//   }
// `;
//
// const QRMobile = styled.div`
//   display: none;
//   align-items: flex-end;
//
//   @media (max-width: 578px) {
//     display: flex;
//   }
// `;
//
// const Info = styled(Inline)`
//   flex-direction: column;
// `;
//
// const AddressRow = styled(Inline)`
//   cursor: pointer;
//   align-items: center;
//   display: flex;
//   gap: 12px;
// `;
//
// const InfoBlock = styled(Inline)`
//   gap: ${props => props.theme.spacing.huge};
//
//   @media (max-width: 578px) {
//     display: grid;
//     grid-template-columns: auto 1fr;
//     column-gap: ${props => props.theme.spacing.extra};
//     row-gap: ${props => props.theme.spacing.medium};
//   }
// `;
//
// const renderAddress = ({
//   textToCopy,
//   textToDisplay,
//   prefixIcon = null,
//   size = 'md'
// }) => {
//   return (
//     <AddressRow>
//       <Copy textToCopy={textToCopy}>
//         <Row align='center' gap='2px'>
//           {size === 'sm'
//             ? (
//               <>
//                 <SecondaryText>{prefixIcon}</SecondaryText>
//                 <SecondaryText>
//                   {textToDisplay}
//                 </SecondaryText>
//               </>
//               )
//             : (
//               <Text
//                 bold
//                 size='20px'
//                 lineHeight='28px'
//               >
//                 {prefixIcon}{textToDisplay}
//               </Text>
//               )}
//         </Row>
//       </Copy>
//     </AddressRow>
//   );
// };

const ConvertationErrorTitle = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ConvertationErrorDescription = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
`;

const ConvertationErrorContent = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: center;
  gap: 4px;
  height: 100%;
`;

const ConvertationErrorContentIcon = styled.div`
  margin-bottom: 4px;
`;

export const ConvertationError = () => {
  return (
    <Tooltip
      tooltip={
        <>
          <ConvertationErrorTitle>Not available</ConvertationErrorTitle>
          <ConvertationErrorDescription>
            Sorry, couldn’t show balance in USD, because server is not responding.
          </ConvertationErrorDescription>
        </>
      }
      placement='top-start'
    >
      <ConvertationErrorContent>
        <AmountCurrency>$ N/A</AmountCurrency>
        <ConvertationErrorContentIcon>
          <HintIcon />
        </ConvertationErrorContentIcon>
      </ConvertationErrorContent>
    </Tooltip>
  );
};

export const PoolNaminator = ({ naminators }) => {
  const curNaminators = naminators?.pool?.currentNominators || 0;
  const apy = naminators?.pool?.apy ? naminators.pool.apy : '';
  const cycle_end = naminators?.pool?.cycleEnd ? naminators.pool.cycleEnd : '';
  const min_stake = naminators?.pool?.minStake ? naminators.pool.minStake : '';
  const total = naminators?.pool?.totalAmount ? naminators.pool.totalAmount : 0;
  const naminatorsMax = naminators?.pool?.maxNominators ? naminators.pool.maxNominators : 0;

  const cycleEnd = Number(cycle_end * 1000);
  const apyProc = Number(apy).toFixed(2);

  const endTimeInHours = Math.round((converTimeToHour(cycleEnd)));
  let procLoadedStaking = (converTimeToHour(Date.now()) / converTimeToHour(cycleEnd)) * 100;
  procLoadedStaking = procLoadedStaking > 100 ? 100 : procLoadedStaking;

  return (
    <>
      <AccountSection subtitle={'Implementation'} gap={2} isHug>
        {naminators?.implementation
          ? (
              <Text className={'l2'} type={'history-address'}>
                <Link href={naminators?.implementation?.url}>
                  {naminators?.implementation?.name}
                </Link>
              </Text>
            )
          : (
              <Text className={'l2'}>
                {naminators?.implementation?.name}
              </Text>
            )}
      </AccountSection>
      <AccountSection subtitle={'Est. APY rate'} gap={2} isHug>
        <Text className={'l2'}>
          {apyProc}%
        </Text>
      </AccountSection>
      <AccountSection subtitle={'Minimal deposit'} gap={2} isHug>
        <Text className={'l2'}>
          {Intl.NumberFormat('ru').format(Number(min_stake) / 1000000000)} TON
        </Text>
      </AccountSection>
      <AccountSection subtitle={'Next cycle'} gap={2} isHug>
        <Text className={'l2'}>
          {/* @ts-ignore */}
          <StakingCycle
            end={endTimeInHours}
            endCycle={cycleEnd}
            proc={procLoadedStaking}
            isCountNaminators={false}
          />
        </Text>
      </AccountSection>
      <AccountSection subtitle={'Nominators'} gap={2} isHug>
        <Text className={'l2'}>
          {Number(curNaminators)}{' '}
          {/* @ts-ignore */}
          <StakingCycle
              end={naminatorsMax}
              endCycle={cycleEnd}
              proc={procLoadedStaking}
              isCountNaminators={true}
          />
        </Text>
      </AccountSection>
      <AccountSection subtitle={'Total'} gap={2} isHug>
        <Text className={'l2'}>
          {Intl.NumberFormat('ru').format(Number(total) / 1000000000)} TON
        </Text>
      </AccountSection>
    </>
  );
};

// const CycleLoader = styled.div<{ proc: number }>`
//   width: 100%;
//   background: ${props => props.theme.colors.background.main};;
//   display: flex;
//   flex-direction: column;
//   padding: 12px 10px;
//   border-radius: 12px;
//   gap: 4px;
//   position: relative;
//   user-select: none;
//
//   &::before {
//     content: '';
//     top: 0px;
//     left: 0px;
//     width: ${props => props.proc}%;
//     height: 100%;
//     position: absolute;
//     background: ${props => props.theme.colors.method.get};
//     border-radius: 12px;
//     opacity: 0.4;
//   }
//
//   .cycleHeader {
//     display: flex;
//     justify-content: space-between;
//   }
// `;

const converTimeToHour = (time) => {
  return Math.floor(((time) / (1000 * 60 * 60)) % 24);
};

const StakingCycle = ({
  end = 0,
  proc = 0,
  endCycle = 0,
  isCountNaminators = false
}) => {
  const s = Math.floor(((endCycle - Date.now()) / 1000) % 60);
  const m = Math.floor(((endCycle - Date.now()) / 1000 / 60) % 60);
  const h = Math.floor(((endCycle - Date.now()) / (1000 * 60 * 60)) % 24);

  const [timer, setTimer] = useState({
    seconds: s < 0 ? 0 : s,
    minutes: m < 0 ? 0 : h,
    hours: h < 0 ? 0 : h
  });

  useEffect(() => {
    if (!isCountNaminators) {
      const interval = setInterval(() => {
        const s1 = Math.floor(((endCycle - Date.now()) / 1000) % 60);
        const m2 = Math.floor(((endCycle - Date.now()) / 1000 / 60) % 60);
        const h3 = Math.floor(((endCycle - Date.now()) / (1000 * 60 * 60)) % 24);

        const objTimer = {
          seconds: s1 < 0 ? 0 : s1,
          minutes: m2 < 0 ? 0 : m2,
          hours: h3 < 0 ? 0 : h3
        };

        setTimer(objTimer);
      }, 1000);

      if (timer.hours < 0 && timer.minutes < 0 && timer.seconds < 0) {
        return clearInterval(interval);
      }
    }
  }, []);

  const newHours = timer.hours < 10 ? '0' + timer.hours : timer.hours;
  const newMinutes = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
  const newSeconsd = timer.seconds < 10 ? '0' + timer.seconds : timer.seconds;

  return isCountNaminators ? `Out of ${end}` : `in ${newHours}:${newMinutes}:${newSeconsd}`;
  // return (
  //   <CycleLoader proc={proc}>
  //     <div className={'cycleHeader'}>
  //       <Text style={{ zIndex: 99 }}>
  //         {isCountNaminators
  //           ? endCycle + ' Nominators'
  //           : 'Next cycle'}
  //       </Text>
  //       <Text style={{ zIndex: 99 }} bold>
  //         {isCountNaminators
  //           ? `Out of ${end}`
  //           : `in ${newHours}:${newMinutes}:${newSeconsd}`}
  //       </Text>
  //     </div>
  //     <Text style={{ fontSize: '14px', zIndex: 99 }}>
  //       {isCountNaminators
  //         ? 'Number of nominators for this staking'
  //         : 'All transactions take effect once the cycle ends'}
  //     </Text>
  //   </CycleLoader>
  // );
};

// export const TelegramIconWrapper = styled.div`
//   position: relative;
//   .imgTgIcon, .imgTgIcon2 {
//     border-radius: 50%;
//   }
//
//   .scale {
//     position: absolute;
//     cursor: pointer;
//     transition: 0.2s;
//     left: 0;
//   }
//
//   :hover .scale{
//     width: 124px;
//     height: 124px;
//     box-shadow: 0 0 100px 3px black;
//     //cursor: default;
//   }
// `;

export const MinorSectionContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 0 0 12px 12px;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  flex-direction: column;
  overflow: hidden;
  
  .header-minor {
    padding: 0px 24px;
    @media screen and (max-width: 768px) {
      padding: 0px 12px;
    }
  }
`;

export const GridSectionAccount = styled.div<{isRow?: boolean}>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: ${props => props.isRow ? 'auto' : '48px'};
  width: 100%;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  .row-minor-section {
    display: flex;
    height: 100%;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    gap: 12px;
    
    .l2 {
      cursor: pointer !important;
    }
    
    .name {
      max-width: 150px;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .value-mob {
    gap: 4px;
  }

  @media screen and (max-width: 768px) {
    .value-mob {
      justify-content: flex-end;
    }
    
    .mob {
      display: flex;
      justify-content: flex-end; 
    }
  }
`;

const WrapperContainer = styled.div`
  padding: 12px 0;
  
  .row-minor {
    display: block;
    margin: 0px 24px;
    padding: 8px;
    border-radius: 8px;
    
    @media screen and (min-width: 768px) {
      :hover {
        background: ${props => props.theme.colors.background.controls};
        overflow: hidden;
        cursor: pointer;
      }
    }

    @media screen and (max-width: 768px) {
      margin: 0 12px;
    }
  }
`;

const apiConf = apiConfigV2(true);
const accountService = new AccountsApi(apiConf);

const getNftsAccount = async (address) => {
  try {
    const data: any = await accountService.getNftItemsByOwner({ accountId: address });
    if (!data?.nftItems) throw new Error('Unknown error');
    return data?.nftItems || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getTokensAccount = async (address) => {
  try {
    const data: any = await accountService.getJettonsBalances({ accountId: address });
    if (!data?.balances) throw new Error('Unknown error');
    return data?.balances || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const SkeletonLoader = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const theme = useTheme();

  if (isMobile) {
    return (
      <ContentLoader
        viewBox="0 0 375 36"
        speed={1}
        backgroundColor={theme.colors.background.main}
        foregroundColor={theme.colors.background.card}>
        <rect x="14" y="12" rx="4" ry="4" width="346" height="14" />
      </ContentLoader>
    );
  }

  return (
    <ContentLoader viewBox="0 0 1024 46"
     speed={1}
     backgroundColor={theme.colors.background.main}
     foregroundColor={theme.colors.background.card}>
      <rect x="22" y="18" rx="4" ry="4" width="256" height="16" />
      <rect x="344" y="18" rx="4" ry="4" width="256" height="16" />
      <rect x="670" y="18" rx="4" ry="4" width="256" height="16" />
    </ContentLoader>
  );
};

export const MinorSection = ({
  isTokens = false,
  isCollectibles = false,
  address = ''
}) => {
  const theme = useTheme();
  const isMobile = useMedia('(max-width: 768px)');
  const [data, setData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const pathTo = (e, url) => {
    e.preventDefault();
    window.location.href = url;
    e.stopPropagation();
  };

  const setLoader = (isLoaded: boolean) => {
    setIsLoader(isLoaded);
  };

  useEffect(() => {
    if (isCollectibles) {
      getNftsAccount(address)
        .then(data => setData(data))
        .then(() => setLoader(true))
        .catch(() => setLoader(true));
    } else if (isTokens) {
      getTokensAccount(address)
        .then(data => setData(data))
        .then(() => setLoader(true))
        .catch(() => setLoader(true));
    }
  }, [address]);

  return (
      <Fade opposite when={data.length > 0}>
    <MinorSectionContainer>
      {!isMobile && <GridSectionAccount className={'header-minor'}>
            {isTokens && (
                <>
                  <SecondaryText className={'b2 row-minor-section'}>
                    Token
                  </SecondaryText>
                  <SecondaryText className={'b2 row-minor-section'}>
                    Balance
                  </SecondaryText>
                  <SecondaryText className={'b2 row-minor-section'}>
                    Token wallet
                  </SecondaryText>
                </>
            )}
            {isCollectibles && (
                <>
                  <SecondaryText className={'b2 row-minor-section'}>
                    NFT
                  </SecondaryText>
                  <SecondaryText className={'b2 row-minor-section'}>
                    Collection
                  </SecondaryText>
                  <SecondaryText className={'b2 row-minor-section'}>
                    Address
                  </SecondaryText>
                </>
            )}
          </GridSectionAccount>}
      <WrapperContainer style={{ borderTop: `1px solid ${theme.colors.background.main}` }}>
        {!isLoader && [...new Array(5)].map((item, idx) => <SkeletonLoader key={idx} />)}
        {isLoader && data.map((items) => {
          if (items?.address) {
            const urlPreview: any = items?.previews?.length > 0 ? items?.previews[0]?.url : '';
            const friendlyAddress = addressToBase64(items?.address);
            const addressCollection = items?.collection?.address;
            const nameCollection = items?.collection?.name;
            const link = `${friendlyAddress}`;

            return (
              <Link
                className={'row-minor'}
                href={addressToBase64(items?.address)}
                key={items}
                onClick={(e) => {
                  pathTo(e, addressToBase64(items?.address));
                }}>
                <GridSectionAccount isRow>
                  <div className={'row-minor-section'}>
                    <Avatar src={urlPreview} size={32} isCollectibles />
                    <Truncate length={isMobile ? 9 : 20} text={items?.metadata?.name || 'No name'}/>
                  </div>
                  {!isMobile && (
                    <div className={'row-minor-section'}>
                      <Link href={`/${addressCollection}`}>
                        <Copy textToCopy={addressToBase64(addressCollection)}>
                          <Text
                            className={'l2 name'}
                            type={'history-address'}
                            onClick={(e) => pathTo(e, addressToBase64(addressCollection))}>
                              {nameCollection || formatAddress(addressToBase64(addressCollection), 11)}
                          </Text>
                        </Copy>
                      </Link>
                    </div>
                  )}
                  <div className={'row-minor-section mob'}>
                    <Link href={link}>
                      <Copy textToCopy={friendlyAddress}>
                        <Text
                          className={'l2-mono'}
                          type={'history-address'}
                          onClick={(e) => pathTo(e, link)}>
                          {formatAddress(friendlyAddress, isMobile ? 5 : 11)}
                        </Text>
                      </Copy>
                    </Link>
                  </div>
                </GridSectionAccount>
              </Link>
            );
          } else if (items?.jetton) {
            const friendlyAddress = addressToBase64(items?.jetton?.address);
            const link = `${addressToBase64(address)}/jetton/${friendlyAddress}`;

            return (
              <Link
                href={addressToBase64(items?.address)}
                key={items}
                className={'row-minor'}
                onClick={(e) => {
                  pathTo(e, link);
                }}>
                <GridSectionAccount key={items} isRow>
                  <div className={'row-minor-section'}>
                    <Avatar src={items?.jetton?.image} size={32} />
                    <Text className={'l2 name'}>
                      {items?.jetton?.name}
                    </Text>
                  </div>
                  <div className={'row-minor-section value-mob'}>
                    <Text className={'l2'}>
                      {prettifyPrice((items?.balance || 0) / 1000000000)}{' '}
                    </Text>
                    <SecondaryText className={'l2'}>
                      {items?.jetton?.symbol}
                    </SecondaryText>
                  </div>
                  {!isMobile && (
                    <div className={'row-minor-section mob'}>
                      <Link href={link}>
                        <Copy textToCopy={friendlyAddress}>
                          <Text
                              className={'l2-mono'}
                              type={'history-address'}
                              onClick={(e) => pathTo(e, link)}>
                            {formatAddress(addressToBase64(items?.jetton?.address), isMobile ? 5 : 11)}
                          </Text>
                        </Copy>
                      </Link>
                    </div>
                  )}
                </GridSectionAccount>
              </Link>
            );
          }

          return null;
        })}
      </WrapperContainer>
    </MinorSectionContainer>
      </Fade>
  );
};

export const AccountGridInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, fit-content(100%));
  column-gap: 16px;
  grid-auto-rows: 42px;
  row-gap: 20px;
  
  @media screen and (max-width: 500px) {
    column-gap: 6px;
    grid-template-columns: repeat(2,1fr);
    grid-auto-rows: auto;
  }
`;
