/* eslint-disable max-len */
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { useTheme, css } from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import '@ton-community/contract-verifier-sdk';
import axios from 'axios';
import TonWeb from 'tonweb';
import {
  Account,
  NftCollection,
  NftItem,
  JettonInfo,
  JettonBalance,
  BlockchainApi,
  AccountEvents
} from 'tonapi-sdk-js';
import { useMedia } from 'react-use';
import Lottie from 'lottie-react';
import QR from '../../../core/qr';
import { ComputerIcon } from '../../../core/icons/computer';
import { TermIcon } from '../../../core/icons/terminal';
import { Loader } from '../../../core/loader';
import { Layout } from '../../../core/layout';
import { addressToBase64, base64ToAddress, convertNanoton, formatAddress } from '../../../../helpers';
import { SecondaryText, Text, TitleH4 } from '../../../core/text';
import { Card, CardHistory } from '../../../core/card';
import { AccountInterfaces, hasInterface } from '../../../../types/common';
import { NftDetailsPresenter } from '../../nfts/details';
import { useIsMobile, useResponsive } from '@farfetch/react-context-responsive';
import { useFormattedAddressLength, usePrettyAddress } from '../../../../helpers/hooks';
import { convertIpfsUrl } from '../../../../helpers/url';
import { Gallery } from '../../../core/gallery';
import { useNftListModel } from '../../../../hooks/nfts';
import { prettifyPrice } from '../../../../helpers/numbers';
import { Button } from '../../../core/button';
import { Link } from '../../../core/link';
import { AppRoutes } from '../../../../helpers/routes';
import { AccountGridInfo, ConvertationError, MinorSection, MobileQrWrapper, PoolNaminator } from '../wallet';
import { Truncate } from '../../../core/truncate';
import LogoAnimation from '../../../core/animation/Tonviewer_Grey.json';
import { BottomSheetContext } from '../../../bottom-sheet/Bottom-sheet';
import { Copy } from '../../../core/copy';
import IconDone56 from '../../../core/icons/ic-done-circle-56.svg';
import { apiConfigV2 } from '../../../../helpers/api';
import { JettonDetailsPresenter } from '../../jetton/details';
import { UITextInput } from '../../../core/UITextInput';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { AccountEventsComponent } from 'tonviewer-web/components/Account/AccountEventsComponent';

const executeMethod = async (address: string, name: string, args?: any, setError?: (error: string) => void) => {
  const apiConf = apiConfigV2();
  const blockchainService = new BlockchainApi(apiConf);

  const params = args
    ? {
        accountId: address,
        methodName: name,
        args
      }
    : {
        accountId: address,
        methodName: name
      };

  try {
    return await blockchainService.execGetMethod(params);
  } catch (error) {
    setError(String(error));
  }
};

export type AccountPageErrors = {
  account?: Error;
  nfts?: Error;
  balance?: Error;
  transactions?: Error;
  jettons: Error[];
  tonPriceUSD?: Error;
  nftDetails?: Error;
  nftCollectionDetails?: Error;
  jettonDetails?: Error;
};

export type JettonType = JettonBalance & {
  metadata: JettonInfo['metadata'];
};

export type AccountPageProps = {
  address: string;
  account: any;
  transactions: AccountEvents;
  nfts: NftItem[];
  jettons: JettonType[];
  hasMoreNfts: boolean;
  tonPriceUSD: number;
  jettonDetails?: JettonInfo;
  nftDetails?: NftItem;
  nftCollectionDetails?: NftCollection;
  errors: AccountPageErrors;
  naminators?: any;
  interfaces?: any;
  doscAsm?: any;
  accountData?: any;
  confClientTransaction: any;
  nftsTransactions?: any[];
};

const getAccountTitle = (isNaminator: boolean, account: Account) => {
  if (hasInterface(account, AccountInterfaces.Auction)) return 'Auction';
  if (isEmpty(account) || isNaminator) return isNaminator ? 'Staking' : 'Smart Contract';
  if (hasInterface(account, AccountInterfaces.CodeUpgradable)) return 'Smart Contract';
  if (hasInterface(account, AccountInterfaces.CodeMaybeUpgradable)) return 'Smart Contract';
  if (hasInterface(account, AccountInterfaces.Domain)) return 'Domain';
  if (hasInterface(account, AccountInterfaces.DnsResolver)) return 'DNS Resolver';
  if (hasInterface(account, AccountInterfaces.JettonMaster)) return 'Token';
  if (hasInterface(account, AccountInterfaces.JettonWallet)) return 'Token';
  if (hasInterface(account, AccountInterfaces.NftCollection)) return 'NFT Collection';
  if (hasInterface(account, AccountInterfaces.NftItem)) return 'NFT Item';
  if (hasInterface(account, AccountInterfaces.Subscription)) return 'Subscription';
  return 'Wallet';
};

const useNftDetailsModel = (nftDetails?: NftItem) => {
  const responsive = useResponsive();
  const addressHalfLength = useFormattedAddressLength({});

  if (!nftDetails) return null;

  const { address, dns, metadata, previews, owner } = nftDetails;
  const name = dns || metadata?.name || formatAddress(addressToBase64(address), addressHalfLength);
  const defaultImage = metadata?.image;
  const imgIndex = responsive.greaterThan.sm ? 2 : 1;
  const preview = previews?.[imgIndex]?.url ?? defaultImage;
  const src = preview ? convertIpfsUrl(preview) : '';

  return {
    ...nftDetails,
    ownerName: owner?.name || formatAddress(addressToBase64(owner?.address), addressHalfLength),
    name,
    src
  };
};

const useJettonDetailsModel = (jettonDetails?: JettonInfo) => {
  const address = usePrettyAddress(jettonDetails?.metadata?.address, {});

  if (!jettonDetails) return null;

  const decimals = Number(jettonDetails?.metadata?.decimals || 0) ?? 9;
  const supply = parseFloat(jettonDetails?.totalSupply) / 10 ** decimals;

  return {
    ...jettonDetails,
    address,
    supply
  };
};

type AccountDetailsPresenterProps = AccountPageProps & {
  nftDetailsModel?: any;
  jettonDetailsModel?: any;
  nftListModel?: any;
  blockchain?: any;
  clientConf?: any;
};

// const TitleWrapper = styled.div<{ isMobile?: boolean, isTitleNaminator?: boolean }>`
//   display: flex;
//   flex-direction: ${props => (props.isTitleNaminator && props.isMobile) ? 'column' : 'row'};
//   align-items: ${props => (props.isTitleNaminator && props.isMobile) ? 'start' : 'center'};
//   gap: 16px;
//
//   .ButtonSwitch, .BackToWallet {
//     min-width: auto;
//     width: auto;
//     padding: 8px 12px;
//     border-radius: 10px;
//   }
//
//   .BackToWallet {
//     padding: ${props => props.isMobile ? '8px 4px' : '8px 12px'};
//     img {
//       margin-left: 6px;
//     }
//   }
//
//   @media screen and (max-width: 768px) {
//     flex-direction: row;
//     justify-content: space-between;
//   }
// `;

const ContainerVerifyContract = styled.div`
  display: flex;
  padding: 12px;
  background: ${props => props.theme.colors.background.card};
  width: 100%;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-start;

  @media screen and (max-width: 768px) {
    padding: 18px 16px;
  }

  & img {
    flex-shrink: 0;
    padding: 4px 0 0 4px;
  }

  .InfoContainer {
    display: flex;
    flex-direction: column;
    gap: 4px;

    @media screen and (min-width: 768px) {
      padding: 14px;
    }

    .VerifyTitle {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 6px;
      padding: 0;
    }

    .VerifyDescription {
      hyphens: auto;
      font-size: 14px;
    }

    .verifier-admonition-meta {
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;
      margin-top: 4px;

      .label {
        display: flex;
        align-items: center;
        gap: 6px;

        img {
          fill: currentColor;
          align-self: flex-start;
          flex-shrink: 0;
          height: 16px;
          margin-right: 6px;
          opacity: 0.6;
          width: 16px;
        }

        display: flex;
        align-items: center;
        font-family: Ubuntu Mono, monospace;
        margin-right: 24px;
        margin-top: 12px;
        font-size: 14px;
        opacity: 0.85;
      }
    }
  }
`;

const BlockVerifyContract = ({ address = '', sourceData }) => {
  const { isMobile } = useIsMobile();

  return (
    <ContainerVerifyContract>
      {!isMobile && <IconDone56 />}
      <div className={'InfoContainer'}>
        <Text className={'l2'}>Verified sources</Text>
        <Text className={'VerifyDescription'}>
          This source code compiles to the same exact bytecode that is found on-chain. Verification was carried out
          using the{' '}
          <Link
            href={`https://verifier.ton.org/${address}`}
            style={{
              fontSize: '14px',
              textDecorationLine: 'underline',
              lineHeight: '20px'
            }}
          >
            verification tool
          </Link>
          .
        </Text>
        <div className={'verifier-admonition-meta'}>
          <span className={'label'}>
            <ComputerIcon />
            {sourceData?.compiler} {sourceData?.compilerSettings?.funcVersion}
          </span>
          <span className={'label'}>
            <TermIcon />
            {sourceData?.compilerSettings?.commandLine}
          </span>
        </div>
      </div>
    </ContainerVerifyContract>
  );
};

// const TFilterContainer = styled.div`
//   display: flex;
// `;

// const DropFilterButton = styled.div<{ isOpen: boolean }>`
//   padding: 8px;
//   background-color: ${props => props.theme.colors.text.primary};
//   border-radius: 50%;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   width: 30px;
//   height: 30px;
//
//   img {
//     margin: ${props => props.isOpen ? '0px 0px 6px 0px' : '6px 0px 0px 0px'};
//     transform: ${props => props.isOpen ? 'rotate(-90deg)' : 'rotate(90deg)'};
//     transition: 0.2s;
//   }
//
//   @media screen and (max-width: 768px) {
//     /* padding: 8px; */
//     width: 44px;
//     height: 44px;
//     border: ${props => props.theme.border};
//     background: ${props => props.theme.isDarkTheme
//         ? props.isOpen
//             ? props.theme.colors.text.secondary
//             : 'white'
//         : props.isOpen
//             ? props.theme.colors.text.secondary
//             : 'black'
//     };
//     img {
//       margin: 0;
//       transform: none;
//     }
//   }
// `;

// const DropFilterContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   gap: 10px;
// `;

export const TitleTransaction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: ${props => props.theme.colors.background.card};
  height: 60px;
  border-top-left-radius: ${(props: any) => {
    return props.radius === 'small' ? props.theme.borderRadius.small : props.theme.borderRadius.medium;
  }};
  border-top-right-radius: ${(props: any) => {
    return props.radius === 'small' ? props.theme.borderRadius.small : props.theme.borderRadius.medium;
  }};
  margin-bottom: 1px;

  .title-transaction {
    font-style: normal;
    font-weight: 590;
    font-size: 16px;
  }
`;

// const TransactionFilterButton = ({
//   isOpen = false,
//   setIsOpen,
//   isMobile
// }) => {
//   return (
//     <TFilterContainer>
//       <DropFilterContainer onClick={(e) => {
//         e.preventDefault();
//         setIsOpen(!isOpen);
//       }}>
//         {!isMobile && (
//           <Text bold>
//             Filter by date
//           </Text>
//         )}
//         <DropFilterButton isOpen={isOpen}>
//           {isMobile ? <FilterIcon isOpen={isOpen} /> : <BackIcon />}
//         </DropFilterButton>
//       </DropFilterContainer>
//     </TFilterContainer>
//   );
// };

// const FilterContainer = styled.div`
//   display: flex;
//   gap: 6px;
//   padding: ${props => props.theme.spacing.medium};
//   justify-content: space-between;
//   background-color: ${props => props.theme.colors.background.card};
//   animation: open 0.2s;
//   border-radius: 16px;
//   position: relative;
//
//   .rdrDefinedRangesWrapper {
//     display: none;
//   }
//
//   .DateWrapper, .FilterController {
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//   }
//
//   .DateWrapper {
//     gap: 12px;
//   }
//
//   .FilterController {
//     gap: 12px;
//   }
//
//   .Calendar {
//     position: absolute;
//     z-index: 999;
//     top: 70px;
//     left: 0;
//
//     .rdrDateRangePickerWrapper {
//       box-shadow: 0 0 50px 3px rgba(0, 0, 0, 0.3);
//     }
//   }
//
//   .rdrDateRangePickerWrapper, .rdrCalendarWrapper {
//     border-radius: 16px;
//   }
//
//   .rdrDateDisplayWrapper {
//     display: none;
//   }
//
//   .DateContainer {
//     display: flex;
//     flex-direction: row;
//     gap: 6px;
//     align-items: center;
//
//     input[type="text"] {
//       border: ${props => props.theme.border};
//       font-size: 16px;
//       gap: 8px;
//       -webkit-box-pack: center;
//       -webkit-justify-content: center;
//       -ms-flex-pack: center;
//       justify-content: center;
//       line-height: 20px;
//       width: 150px;
//       border-radius: 14px;
//       padding: ${props => props.theme.spacing.small};
//       background: ${props => props.theme.colors.background.active};
//       color: ${props => props.theme.colors.text.primary};
//       color-scheme: ${props => props.theme.isDarkTheme ? 'dark' : 'light'};
//       outline: none;
//       cursor: pointer;
//       border: 1px solid transparent;
//     }
//   }
//
//   input[type="text"]:hover {
//     border: ${props => `1px solid ${props.theme.colors.button.primary}`}
//   }
//
//   @media screen and (max-width: 768px) {
//     flex-direction: column;
//     align-items: stretch;
//
//     .FilterController {
//       margin-top: 14px;
//     }
//
//     .DateWrapper {
//       flex-direction: row;
//     }
//
//     .FilterController {
//       flex-direction: column;
//
//       button {
//         width: 100%;
//       }
//     }
//
//     .DateContainer {
//       align-items: center;
//
//       input[type="text"] {
//         width: 100%;
//       }
//
//       .subscription {
//         width: 50px;
//       }
//     }
//   }
//
//   @keyframes open {
//     from {
//       opacity: 0;
//     }
//
//     to {
//       opacity: 1;
//     }
//   }
// `;

// function useOutsideAlerter (ref, setIsOpen) {
//   useEffect(() => {
//     /**
//      * Alert if clicked on outside of element
//      */
//     function handleClickOutside (event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     // Bind the event listener
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       // Unbind the event listener on clean up
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [ref, setIsOpen]);
// }

const converDate = date => {
  return new Date(date).toISOString().split('T')[0];
};

// const convertDateColendar = (date) => {
//   const mounth = date.getMonth() + 1;
//   const day = date.getDate();
//   const newMouth = mounth < 10 ? `0${mounth}` : mounth;
//   const newDay = day < 10 ? `0${day}` : day;
//   return `${date.getFullYear()}-${newMouth}-${newDay}`;
// };

const timestemp = (date: string): number => {
  return Math.floor(new Date(date).getTime() / 1000);
};

// const TransactionFilter = ({
//   loadMore,
//   setFirstDate,
//   setSecondDate,
//   firstDate,
//   secondDate
// }) => {
//   const theme = useTheme();
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const { isMobile } = useIsMobile();
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isLoaded2, setIsLoaded2] = useState(false);
//   const [state, setState] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: 'selection'
//     }
//   ]);
//
//   const wrapperRef = useRef(null);
//   useOutsideAlerter(wrapperRef, setIsOpen);
//
//   const handleClickFilter = async () => {
//     setIsLoaded(true);
//
//     await loadMore(
//       20,
//       timestemp(secondDate),
//       timestemp(firstDate),
//       undefined,
//       true
//     );
//
//     setIsLoaded(false);
//   };
//
//   const handleClickReset = async () => {
//     setIsLoaded2(true);
//     await loadMore(20, undefined, undefined, true);
//     setFirstDate(converDate(new Date()));
//     setSecondDate(converDate(new Date()));
//     setState([
//       {
//         startDate: new Date(),
//         endDate: new Date(),
//         key: 'selection'
//       }
//     ]);
//     setIsLoaded2(false);
//   };
//
//   const handleOnChange = (ranges) => {
//     const { selection } = ranges;
//
//     const first = convertDateColendar(selection.startDate);
//     const second = convertDateColendar(selection.endDate);
//
//     setFirstDate(first);
//     setSecondDate(second);
//     setState([selection]);
//
//     if (first !== second) {
//       setIsOpen(false);
//       setIsButtonDisabled(false);
//     } else {
//       setIsButtonDisabled(true);
//     }
//   };
//
//   return (
//     <Spacer mb={theme.spacing.large}>
//       <FilterContainer>
//         <div className={'DateWrapper'}>
//           <div className={'DateContainer'} onClick={() => setIsOpen(true)}>
//             <input
//               type={'text'}
//               value={firstDate}
//               disabled
//             />
//           </div>
//           <Text className={'subscription'}>To</Text>
//           <div className={'DateContainer'} onClick={() => setIsOpen(true)}>
//             <input
//               type={'text'}
//               value={secondDate}
//               disabled
//             />
//           </div>
//         </div>
//         {isOpen && (
//           <div className={'Calendar'} ref={wrapperRef}>
//             <DateRangePicker
//               onChange={handleOnChange}
//               showSelectionPreview={false}
//               moveRangeOnFirstSelection={false}
//               months={2}
//               ranges={state}
//               showMonthAndYearPickers={false}
//               shownDate={false}
//               direction={isMobile ? 'vertical' : 'horizontal'}
//             />
//           </div>
//         )}
//         <div className={'FilterController'}>
//           <Button
//             variant={'primary'}
//             onClick={() => handleClickFilter()}
//             disabled={isButtonDisabled}
//           >
//             {isLoaded ? <ButtonLoader isPrimary /> : 'Search'}
//           </Button>
//           <Button
//             variant={'secondary'}
//             onClick={() => handleClickReset()}
//           >
//             {isLoaded2 ? <ButtonLoader /> : 'Reset Filter'}
//           </Button>
//         </div>
//       </FilterContainer>
//     </Spacer>
//   );
// };

const ContractMethodsMainContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: ${props => props.theme.colors.background.card};
  border-radius: 0 0 12px 12px;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }

  .ItemMethod {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 12px 16px;
    //background: ${props => props.theme.colors.background.controls};
    border: ${props => props.theme.border};
    border-radius: 12px;

    .resultDataItem {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      word-break: break-all;

      .data {
        display: block;
        width: auto;
      }

      @media screen and (max-width: 768px) {
        flex-direction: column;
        align-items: start;
        justify-content: center;
      }
    }

    .resultData {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .gridMethodResult {
      display: grid !important;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1px 1fr;
      column-gap: 24px;
      row-gap: 24px;

      .Separator {
        width: 100%;
        height: 1px;
        background: ${props => props.theme.colors.background.main};
      }
    }
  }

  .TitleMethod {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${props => props.theme.colors.separator};

    input {
      padding: 8px 16px;
      border-radius: 8px;
      max-width: 300px;
      width: 100%;
      outline: none;
      color: ${props => props.theme.colors.text.primary};
      background: ${props => props.theme.colors.background.card};
      border: 1px solid transparent;
    }
    input:focus {
      border: 1px solid ${props => props.theme.colors.separator.default};
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: start;
      justify-content: center;
      gap: 12px;

      div > input,
      button {
        height: 44px;
        width: 100%;
      }
    }

    .NameMethod {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;

      img {
        margin-top: 4px;
      }
    }

    span {
      display: flex;
      height: 100%;

      .showInputeField {
        display: flex;
        align-items: center;
        user-select: none;
        cursor: pointer;
        transition: 0.2s;
        transform: rotate(0deg);

        &.show {
          transform: rotate(180deg);
        }
      }
    }
  }
`;

const ListMethodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 312px;
  padding: 0 16px 0 16px;
  border-right: 1px solid ${props => props.theme.colors.separator.default};

  @media screen and (max-width: 768px) {
    border: none;
    padding-bottom: 24px;
    border-bottom: 1px solid ${props => props.theme.colors.separator.default};
  }

  .type-section-methods {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item-method {
    width: 100%;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .loader-method {
      height: 16px;
    }

    .loader-wrapper {
      height: 16px;
    }

    span {
      cursor: pointer;
    }

    :hover {
      background: ${props => props.theme.colors.background.active};
    }
  }

  .active {
    background: ${props => props.theme.colors.background.active};
  }
`;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ArbitaryMethods = styled.div<{ isExecute?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  gap: 12px;

  ${props =>
    props.isExecute &&
    css`
      border-bottom: 1px solid ${props => props.theme.colors.separator.default};
    `}

  .item-param-wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;

    .delete-param {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 24px;
        color: ${props => props.theme.colors.text.secondary};
        cursor: pointer;
        :hover {
          opacity: 0.5;
        }
      }
    }
  }

  .input-method {
    max-width: 400px;

    .input-switch-type {
      border-radius: 0 8px 8px 0 !important;
    }
  }

  .wrapper-add-params {
    margin-top: 8px;
    display: flex;
    gap: 10px;
  }
`;

const ViewResult = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  overflow: hidden;
  width: 100%;
  gap: 12px;

  .section-result {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    .item-section-result {
      display: flex;
      flex-direction: row;
      width: 100%;
      overflow: hidden;
      gap: 8px;

      .value-item-result {
        display: inline-table;
        table-layout: fixed;
        width: 100%;

        .b2-mono {
          display: table-cell;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
`;

const ContractMethods = ({ constractMethods = [], address }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [result, setResult] = useState(undefined);
  const typesArray = ['NaN', 'Null', 'Number', 'Slice', 'Cell'];
  const [error, setError] = useState<null | string>(null);
  const [methodName, setMethodName] = useState('');
  const [params, setParams] = useState([]);
  const [currentExecuteMethod, setCurrentExecuteMethod] = useState<null | string>(null);
  const [serializeParams, setSerializeParams] = useState<string[]>();

  const handleExecuteMethod = async (name, isTab = false) => {
    setCurrentExecuteMethod(name);
    try {
      const data =
        serializeParams?.length > 0 && !isTab
          ? await executeMethod(address, name, serializeParams.join(','), setError)
          : await executeMethod(address, name, undefined, setError);

      setResult(data);
    } catch (error) {
      setError(error);
    }
    setTimeout(() => {
      setCurrentExecuteMethod(null);
    }, 200);
  };

  const handleSetType = (type: string, idx: number) => {
    const newArrayParams = [...params];
    newArrayParams[idx].param.type = type;

    if (type === 'Null' || type === 'NaN') {
      newArrayParams[idx].param.value = type;
    } else if (type === 'Number') {
      newArrayParams[idx].param.value = '';
      // @ts-ignore
    } else if (type !== 'Null' || type !== 'NaN' || type !== 'Number') {
      newArrayParams[idx].param.value = '';
    }
    setParams(newArrayParams);
  };

  const handleSetValue = (value: string, idx: number) => {
    const newArrayParams = [...params];
    const type = newArrayParams[idx].param.type;
    const isNumber = /^[a-fA-F0-9|x]+$/.test(value) || value === '';

    if ((isNumber && type === 'Number') || type !== 'Number') {
      newArrayParams[idx].param.value = value;
    }
    setParams(newArrayParams);
  };

  const handleDeleteParamField = (idx: number) => {
    const newArrayParams = params.filter((item, i) => i !== idx);
    setParams(newArrayParams);
  };

  const handleAddParams = () => {
    setParams(items => [
      ...items,
      {
        param: {
          type: typesArray[0],
          value: typesArray[0]
        }
      }
    ]);
  };

  useEffect(() => {
    if (params.length > 0) {
      const decodeObject = [];
      params.forEach(item => {
        const { value } = item.param;
        if (value !== '') decodeObject.push(value);
      });

      setSerializeParams(decodeObject);
    }
  }, [params]);

  useEffect(() => {
    if (error !== null) {
      setMethodName(error.split(':')[1]);
    }
  }, [error]);

  useEffect(() => {
    if (constractMethods.length > 0) {
      // handleExecuteMethod(constractMethods[0]);
      setMethodName(constractMethods[0]);
    }
  }, [constractMethods]);

  const arrTuplesData = [];
  const getTuple = (type: string, item: any) => {
    if (type === 'tuple' && Array.isArray(item[type])) {
      item[type].forEach((data, idx) => {
        if (data?.type === 'tuple' && Array.isArray(data[data?.type])) {
          getTuple(data?.type, data);
        } else {
          arrTuplesData.push(data);
        }
      });
    }
  };

  return (
    <ContractMethodsMainContainer>
      <ListMethodsContainer>
        <div className={'type-section-methods'}>
          <SecondaryText>Get</SecondaryText>
          {constractMethods.map((item, idx) => {
            const isActive = activeIdx === idx ? 'item-method active' : 'item-method';
            return (
              <div
                className={isActive}
                key={item + idx}
                onClick={() => {
                  setError(null);
                  setActiveIdx(idx);
                  setMethodName(constractMethods[idx]);
                  handleExecuteMethod(constractMethods[idx], true);
                }}
              >
                <Text className={'l2'}>{item}</Text>
                {currentExecuteMethod === item && <Loader isTab className={'loader-method'} />}
              </div>
            );
          })}
        </div>
      </ListMethodsContainer>
      <ViewContainer>
        <ArbitaryMethods isExecute={result}>
          <UITextInput
            className={'input-method'}
            type={'text'}
            label={'Arbitrary method'}
            placeholder={'Example: qet_pool_data'}
            value={methodName}
            error={error}
            onChange={value => {
              setMethodName(value);
              setError(null);
            }}
          />
          {params.map((item, idx) => {
            return (
              <div className={'item-param-wrapper'} key={item.type + idx + 'input'}>
                <UITextInput
                  noLabel
                  type={'switch-type-text'}
                  label={'Arbitrary method'}
                  arrayTypes={typesArray}
                  placeholder={item.param.type === 'Number' ? '0xF1F1F1 or 123456' : 'Value'}
                  setSelectedType={value => handleSetType(value, idx)}
                  onChange={value => handleSetValue(value, idx)}
                  disabled={item.param.type === 'NaN' || item.param.type === 'Null'}
                  value={item.param.value}
                />
                <div className={'delete-param'} onClick={() => handleDeleteParamField(idx)}>
                  <span className={'icon-ic-xmark-16'}></span>
                </div>
              </div>
            );
          })}
          <div className={'wrapper-add-params'}>
            <Button variant={'secondary'} onClick={handleAddParams}>
              <span className={'icon-ic-plus-16'}></span>
              Add Argument
            </Button>
            <Button variant={'primary'} disabled={methodName === ''} onClick={() => handleExecuteMethod(methodName)}>
              Execute
            </Button>
          </div>
        </ArbitaryMethods>
        {result && (
          <ViewResult>
            <div className={'section-result'}>
              <div className={'item-section-result'}>
                <SecondaryText className={'b2'}>Exit code: </SecondaryText>
                <Text className={'b2-mono'}>{result.exitCode}</Text>
              </div>
            </div>
            <div className={'section-result'}>
              {result?.decoded &&
                Object.keys(result?.decoded || {}).map(item => {
                  if (Array.isArray(result?.decoded[item])) {
                    return result?.decoded[item].map((data, idx) => {
                      if (data?.type) return null;
                      const objToArr = Object.keys(data);
                      return objToArr.map((key, i) => {
                        return (
                          <div className={'item-section-result'} key={idx + JSON.stringify(data[key])}>
                            <SecondaryText className={'b2'}>{key}: </SecondaryText>
                            <Copy textToCopy={JSON.stringify(data[key])}>
                              <div className={'value-item-result'}>
                                <Text className={'b2-mono'}>{JSON.stringify(data[key])}</Text>
                              </div>
                            </Copy>
                          </div>
                        );
                      });
                    });
                  }

                  return (
                    <div className={'item-section-result'} key={item}>
                      <SecondaryText className={'b2'}>{item}: </SecondaryText>
                      <Copy textToCopy={JSON.stringify(result?.decoded[item])}>
                        <div className={'value-item-result'}>
                          <Text className={'b2-mono'}>{JSON.stringify(result?.decoded[item])}</Text>
                        </div>
                      </Copy>
                    </div>
                  );
                })}
            </div>
            <div className={'section-result'}>
              {result?.stack.map(item => {
                const { type } = item;
                if (Array.isArray(item[type]) && type === 'tuple') {
                  getTuple(type, item);
                  if (arrTuplesData.length === 0) return null;
                  return arrTuplesData.map((data, idx) => {
                    const { type } = data;
                    return (
                      <div className={'item-section-result'} key={type + JSON.stringify(data[type])}>
                        <SecondaryText className={'b2'}>{type}: </SecondaryText>
                        <Copy textToCopy={JSON.stringify(data[type])}>
                          <div className={'value-item-result'}>
                            <Text className={'b2-mono'}>{JSON.stringify(data[type])}</Text>
                          </div>
                        </Copy>
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className={'item-section-result'} key={type + JSON.stringify(item[type])}>
                      <SecondaryText className={'b2'}>{type}: </SecondaryText>
                      <Copy textToCopy={JSON.stringify(item[type])}>
                        <div className={'value-item-result'}>
                          <Text className={'b2-mono'}>{JSON.stringify(item[type])}</Text>
                        </div>
                      </Copy>
                    </div>
                  );
                }
              })}
            </div>
          </ViewResult>
        )}
      </ViewContainer>
    </ContractMethodsMainContainer>
  );
};

const TransactionWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  min-width: 464px;
  gap: 16px;

  @media screen and (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }

  .header-send-ton {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    border-bottom: 1px solid rgba(131, 137, 143, 0.16);
    padding: 20px 24px;
  }

  .container-qr {
    padding: 0px 24px 20px 24px;
    width: 100%;
  }

  .qr-wrapper-send-transaction {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 0px;
    border-radius: 8px;
    background: ${props => props.theme.colors.background.active};
    margin-top: 4px;
  }

  .wrapper-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    .input-info-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .TitleTransaction {
    font-size: 24px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 12px;
    align-items: center;
    text-align: start;

    @media screen and (max-width: 768px) {
      padding: 0;
    }
  }

  .btnSendTransaction {
    width: 100%;
    margin-top: 18px;
    background: ${props => (props.theme.isDarkTheme ? props.theme.colors.icon.white : props.theme.colors.icon.black)};
    color: ${props => (props.theme.isDarkTheme ? props.theme.colors.icon.black : props.theme.colors.icon.white)};
  }

  .qrWrapper {
    margin-bottom: 18px;
  }

  .InputWrapper {
    width: 100%;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    @media screen and (max-width: 768px) {
      padding: 0;
    }
  }

  .necesRed {
    color: ${props => props.theme.colors.method.delete};
  }

  .TransactionContainer {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
    padding: 0px 24px;
    gap: 18px;
    width: 100%;
    .inputAmountTon {
      //-webkit-appearance: textfield;
      //-moz-appearance: textfield;
      //appearance: textfield;
      max-height: 50px;
      padding: 8px 16px;
      background: ${props => props.theme.colors.background.active};
      outline: none;
      color: ${props => props.theme.colors.text.primary};
      border: 1px solid ${props => props.theme.colors.separator.default};
      width: 100%;
      border-radius: 8px;

      @media screen and (max-width: 768px) {
        margin: 0;
        font-size: 18px;
      }
    }
    .inputAmountTon:focus {
      border: 1px solid ${props => props.theme.colors.separator.default};
    }
    .inputAmountTon::-webkit-inner-spin-button,
    .inputAmountTon::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    .inputAmountTon:disabled {
      opacity: 0.5;
    }
  }
`;

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  outline: none;
  color: ${props => props.theme.colors.text.primary};
  padding: 0px 12px;
  border: 1px solid rgba(131, 137, 143, 0.32);
  background: ${props => props.theme.colors.background.active};
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }

  & :first-child {
    border-radius: 8px 8px 0 0;
  }

  & :last-child {
    border-radius: 0 0 8px 8px;
  }

  .itemSection {
    min-height: 44px;
    height: 44px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  .selected {
    cursor: default;
    opacity: 0.5;
  }

  // .itemSection:hover {
  //   background: ${props => props.theme.colors.background.controls};
  // }
`;

export const SectionsComponent = ({ sections = [], selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionsWrapper>
      <div className={'itemSection'} onClick={() => setIsOpen(!isOpen)}>
        {selected?.name}
        <span className={'icon-ic-chevron-down-16'} />
      </div>
      {isOpen &&
        sections.map((item, i) => {
          const classNameItem = `itemSection ${item?.name !== selected?.name && 'selected'}`;
          return (
            <div
              key={item?.name + i}
              className={classNameItem}
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
              }}
            >
              {item?.name}
            </div>
          );
        })}
    </SectionsWrapper>
  );
};

const TransactionComponent = ({ address = '', isStaking = false }) => {
  const sections = isStaking
    ? [
        {
          name: 'withdraw',
          msg: 'w'
        },
        {
          name: 'deposit',
          msg: 'd'
        }
      ]
    : [
        {
          name: 'transfer',
          msg: ''
        }
      ];

  const router = useRouter();
  const [selected, setSelected] = useState(sections[0]);
  const [amount, setAmount] = useState<undefined | number>();
  const [msg, setMsg] = useState('');
  const [isBtnSend, setIsBtnSend] = useState(false);
  const isMobile = useMedia('(max-width: 768px)');

  const isWithdraw = selected.name === 'withdraw';
  const srtAmoutUrl = amount ? amount * 1000000000 : 0;
  const urlTransaction = `ton://transfer/${address}?amount=${srtAmoutUrl}&text=${msg || ''}`;

  useEffect(() => {
    setIsBtnSend(amount && amount > 0);
  }, [amount]);

  return (
    <TransactionWrapper>
      <div className={'header-send-ton'}>
        <TitleH4>Send TON</TitleH4>
        <SecondaryText>
          <Truncate length={isMobile ? 12 : 10} text={address}></Truncate>
        </SecondaryText>
      </div>
      <div className={'TransactionContainer'}>
        {sections.length > 1 && (
          <UITextInput
            label={'Type'}
            type={'sections'}
            sections={sections}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        <UITextInput
          type={'number'}
          placeholder={'0.001 TON'}
          label={'Amount *'}
          disabled={isWithdraw}
          step={0.01}
          min={0}
          lang={'en'}
          value={isWithdraw ? 1.0 : amount}
          onChange={setAmount}
        />
        <UITextInput
          type={'text'}
          placeholder={'Example: Hello, my friend!'}
          label={'Message'}
          value={isStaking ? selected.msg : msg}
          secondaryText={'Max 64 characters'}
          onChange={setMsg}
          disabled={isStaking}
        />
      </div>
      <SecondaryText className={'b2'} style={{ textAlign: 'center' }}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Scan the QR code below with your TON crypto
        <br />
        wallet's camera.
      </SecondaryText>
      {!isMobile && (
        <div className={'container-qr'}>
          <div className={'qr-wrapper-send-transaction'}>
            <QR value={urlTransaction} size={250} />
          </div>
        </div>
      )}
      {isMobile && (
        <Button
          className={'btnSendTransaction'}
          disabled={!isBtnSend}
          onClick={async e => {
            e.preventDefault();
            await router.push(urlTransaction);
          }}
        >
          Make a transaction
        </Button>
      )}
    </TransactionWrapper>
  );
};

const AccountSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .font-mono {
    font-family: 'SF Mono', 'SF Pro Display', 'sans-serif';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
  }

  .default {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
  }

  .balance-wrapper {
    display: flex;
    gap: 4px;

    h4 {
      font-weight: 700;
      font-size: 20px;
    }
  }

  .balance-usd {
    color: ${props => props.theme.colors.text.secondary};
  }

  .subtitleSection {
    width: 100%;
    display: flex;
    height: 20px;
    align-items: center;

    .subtitleText {
      color: ${props => props.theme.colors.text.secondary};
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
    }
  }
`;

export const AccountSection = ({ subtitle, children, gap = 2, isHug = false }) => {
  const isMobile = useMedia('(max-width: 768px)');
  const column = subtitle === 'Raw' ? (isMobile ? '2' : '2 / span 3') : subtitle === 'Next cycle' ? '1' : 'auto';

  return (
    <AccountSectionWrapper
      style={{
        gap,
        width: isHug ? 'auto' : '100%',
        gridColumn: column
      }}
    >
      <div className={'subtitleSection'}>
        <SecondaryText className={'b2'}>{subtitle}</SecondaryText>
      </div>
      {children}
    </AccountSectionWrapper>
  );
};

export const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${props => props.theme.colors.background.card};
  border-radius: 12px;

  .accountHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.colors.background.main};
    padding: 0 24px 0 24px;
    height: 56px;

    @media screen and (max-width: 768px) {
      padding: 0 16px 0 16px;
    }

    .send-transaction {
      gap: 6px;
      height: 32px;
      padding: 6px 12px;
    }

    .sectionHeaderAccount {
      display: flex;
      height: 100%;
      gap: 20px;

      @media screen and (max-width: 768px) {
        width: 100%;
        gap: 14px;
      }

      .section {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;

        .wrapper-text {
          display: flex;
          flex-direction: row;
          gap: 6px;
          align-items: center;

          .icon-ic-loader-16 {
            color: ${props => props.theme.colors.text.primary};
          }
        }

        .item-text {
          cursor: pointer;
          color: ${props => props.theme.colors.text.secondary};
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
        }

        hr {
          margin: 0;
          position: absolute;
          width: 100%;
          bottom: 0;
          outline: none;
          border: 1px solid ${props => props.theme.colors.text.primary};
        }
      }

      .active {
        .item-text {
          cursor: default;
          color: ${props => props.theme.colors.text.primary};
        }
      }
    }
  }

  .accountInfoWrapper {
    display: flex;
    padding: 20px 24px 24px 24px;

    .qr-open {
      display: flex;
      position: fixed;
      width: 100%;
      height: 100vh;
      justify-content: center;
      align-items: center;
      background: rgba(94, 94, 94, 0.66);
      z-index: 9999;
      left: 0;
      top: 0;
      backdrop-filter: blur(5px);

      .qr-card {
        position: relative;
        width: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 50px 44px 44px 50px;

        span {
          right: 6px;
          top: 6px;
          position: absolute;
          cursor: pointer;
        }
      }
    }

    .avatar-wrapper {
      padding: 0px 24px 0px 20px;
    }

    .account-avatar {
      padding: 0px 24px 0px 0px;
    }

    @media screen and (max-width: 768px) {
      padding: 16px;
      flex-direction: column !important;
    }
  }

  .accountInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 20px;

    .jetton-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: auto;

      @media screen and (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        row-gap: 20px;
        column-gap: 6px;
      }
    }
  }
`;

const ButtonAccountMobileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

export const base64ToHex = str => {
  return btoa(
    str
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join('')
  );
};

export const AccountDetailsPresenter: FC<AccountDetailsPresenterProps> = ({
  address,
  account,
  errors,
  nftDetailsModel,
  nftCollectionDetails,
  jettonDetailsModel,
  nftListModel,
  transactions,
  jettons,
  tonPriceUSD,
  nfts,
  hasMoreNfts,
  naminators,
  blockchain,
  doscAsm
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const [isCodeSection, setIsCodeSection] = useState(false);
  const [codeHash, setCodeHash] = useState('');
  const [isLoad, setIsLoad] = useState(false);
  const [sourceData] = useState();
  const { setComponent, onOpen } = useContext(BottomSheetContext);

  // @ts-ignore
  const { interfaces: inrf } = account?.interfaces || { interfaces: null };
  const isViewContract = isCodeSection && codeHash !== '';
  const contractType = (inrf || account.interfaces)?.join(', ') || '–';
  const isNominator = contractType === 'tf_nominator' || contractType === 'whales_nominators';
  const isMethods = Array.isArray(account?.getMethods) && account?.getMethods?.length > 0;
  const rawAddress = base64ToAddress(address);
  const [activeIndex, setActiveIndex] = useState(0);

  const accountTitle = getAccountTitle(isNominator && naminators, account);
  const sections = [accountTitle, 'Tokens', 'Collectibles', isMobile ? 'Code' : 'Source code', 'Methods'];

  const addressFormat = usePrettyAddress(account.address, { coef: 30, fullOnDesktop: true });
  const addressRaw = usePrettyAddress(rawAddress, { coef: 45, fullOnDesktop: true }, true);
  const addressFormatRaw = !isMobile ? formatAddress(rawAddress, 11) : addressRaw;
  const isAccountName = account?.name && account?.name !== 'unknown' && account?.name !== '';
  const [isLoadedCode, setIsLoadedCode] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [isOpenQrModal, setIsOpenQrModal] = useState(false);

  const jettonsArr =
    jettons?.map(({ jetton, balance }: any) => {
      const decimals = jetton?.decimals ?? 9;
      const result = parseFloat(balance) / 10 ** decimals;

      return {
        image: jetton?.image,
        label: jetton?.name,
        symbol: jetton?.symbol,
        value: prettifyPrice(result),
        link: AppRoutes.jettonDetails(account?.address, jetton?.address)
      };
    }) || [];

  const getCellHash = async () => {
    const hexToBytes = TonWeb.utils.hexToBytes(blockchain?.code);
    const Boc = TonWeb.boc.Cell.oneFromBoc(hexToBytes);
    const hashCellCode = await Boc.hash();
    const hex = TonWeb.utils.bytesToHex(hashCellCode);
    const hexToBase64 = base64ToHex(hex);
    setCodeHash(hexToBase64);
  };

  const handleOpenModal = () => {
    onOpen(true);

    setComponent(<TransactionComponent address={addressToBase64(address)} isStaking={isNominator && naminators} />);
  };

  const handleOpenQr = () => {
    if (isMobile) {
      onOpen(true);
      setComponent(
        <MobileQrWrapper>
          <QR value={address} size={300} />
        </MobileQrWrapper>
      );
    }
  };

  const handleChangeTab = (idx: number) => {
    setActiveIndex(idx);

    setIsVerifyCode(false);
    setIsLoadedCode(false);

    const url = `/${addressToBase64(rawAddress)}`;
    router.replace({
      pathname: url,
      query: idx > 0 ? { section: sections[idx] } : {}
    });
  };

  useEffect(() => {
    if (blockchain?.code) {
      getCellHash();
    }
  }, [blockchain]);

  useEffect(() => {
    const section = router.query?.section || '';
    if (section !== '') {
      const idxSection = sections.findIndex(item => {
        return item === section;
      });

      setActiveIndex(idxSection);
    }

    setIsLoad(true);
  }, [router]);

  useEffect(() => {
    setIsCodeSection(activeIndex === 3);
  }, [activeIndex]);

  const MAX_COUNT_ITEMS = 11;
  let countIsNull = 0;
  const tokens = [...jettonsArr].slice(0, isMobile ? 5 : MAX_COUNT_ITEMS).filter(item => {
    countIsNull++;
    return Number(item.value) !== 0;
  });

  const collectibles = [...nftListModel].slice(0, isMobile ? 3 : MAX_COUNT_ITEMS);
  const otherCountTokens = jettonsArr.length - tokens.length + countIsNull;
  const otherCountCollecribles = nftListModel.length - collectibles.length;
  const isShowVerify = isLoadedCode && isVerifyCode;

  if (!isLoad) return null;

  return (
    <Layout>
      <AccountWrapper>
        <div className={'accountHeader'}>
          <div className={'sectionHeaderAccount'}>
            {sections.map((item, idx) => {
              const className = activeIndex === idx ? 'section active' : 'section';
              const isLoader = !isLoadedCode && idx === 3 && activeIndex === idx;

              if (idx === 1 && tokens.length === 0) return null;
              if (idx === 2 && collectibles.length === 0) return null;
              if ((idx === 1 || idx === 2) && accountTitle === 'NFT Item') return null;
              if (idx === 4 && !isMethods) return null;

              return (
                <div key={idx + item} className={className} onClick={() => handleChangeTab(idx)}>
                  <div className={'wrapper-text'}>
                    <Text className={'l1 item-text'}>{item}</Text>
                    {isLoader && <Loader isTab />}
                  </div>
                  {activeIndex === idx && <hr />}
                </div>
              );
            })}
          </div>
          {!isMobile && (
            <Button className={'send-transaction'} onClick={handleOpenModal} variant={'secondary'}>
              <Text className={'l2'} style={{ cursor: 'pointer' }}>
                Send transaction
              </Text>
            </Button>
          )}
        </div>
        {activeIndex === 0 && (
          <div className={'accountInfoWrapper'}>
            <div className={'accountInfo'}>
              <AccountSection subtitle={'Account address'} gap={2}>
                <Copy textToCopy={addressToBase64(rawAddress)}>
                  <Text className={'l2-mono'}>{addressFormat}</Text>
                </Copy>
              </AccountSection>
              {isAccountName && (
                <AccountSection subtitle={'Account name'} gap={2} isHug>
                  <Copy textToCopy={account.name}>
                    <Text className={'l2-mono'}>{account.name}</Text>
                  </Copy>
                </AccountSection>
              )}
              <AccountSection subtitle={'Balance'} gap={2}>
                <div className={'balance-wrapper'}>
                  <TitleH4>{prettifyPrice(convertNanoton(account.balance))} TON</TitleH4>
                  {errors.tonPriceUSD ? (
                    <ConvertationError />
                  ) : (
                    <TitleH4 style={{ color: theme.colors.text.secondary }}>
                      {` ≈ $${prettifyPrice(tonPriceUSD)}`}
                    </TitleH4>
                  )}
                </div>
              </AccountSection>
              {tokens.length > 0 && (
                <AccountSection subtitle={'Tokens'} gap={8}>
                  <Gallery
                    isToken
                    items={tokens}
                    max={isMobile ? 5 : MAX_COUNT_ITEMS}
                    onViewAll={() => setActiveIndex(1)}
                    numOfNotFit={otherCountTokens}
                  />
                </AccountSection>
              )}
              {collectibles.length > 0 && (
                <AccountSection subtitle={'Collectibles'} gap={8}>
                  <Gallery
                    items={collectibles}
                    isCollectibles
                    max={isMobile ? 3 : MAX_COUNT_ITEMS}
                    onViewAll={() => setActiveIndex(2)}
                    numOfNotFit={otherCountCollecribles}
                  />
                </AccountSection>
              )}
              {nftCollectionDetails && (
                <NftDetailsPresenter
                  metadata={nftCollectionDetails.metadata}
                  owner={nftCollectionDetails.owner}
                  name={nftCollectionDetails.metadata?.name}
                  image={nftCollectionDetails.metadata?.image || nftCollectionDetails.metadata?.cover_image}
                />
              )}
              <AccountGridInfo>
                <AccountSection subtitle={'Contract type'} gap={2} isHug>
                  <Text className={'l2'}>{contractType}</Text>
                </AccountSection>
                <AccountSection subtitle={'Raw'} gap={2} isHug>
                  <Copy textToCopy={rawAddress}>
                    <Text className={'l2-mono'}>{addressFormatRaw}</Text>
                  </Copy>
                </AccountSection>
                {isNominator && naminators && <PoolNaminator naminators={naminators} />}
              </AccountGridInfo>
              {!isViewContract && isMobile && (
                <ButtonAccountMobileWrapper>
                  <Button onClick={handleOpenModal} variant={'secondary'} style={{ width: '100%', minWidth: 'auto' }}>
                    Send transaction
                  </Button>
                  <Button onClick={handleOpenQr} variant={'secondary'} style={{ width: '100%', minWidth: 'auto' }}>
                    Show QR code
                  </Button>
                </ButtonAccountMobileWrapper>
              )}
            </div>
            {!isMobile && !isOpenQrModal && (
              <div className={'qr-hide'} onClick={() => setIsOpenQrModal(!isOpenQrModal)}>
                <QR value={`ton://transfer/${address}`} size={132} />
              </div>
            )}
            {!isMobile && isOpenQrModal && (
              <div className={'qr-open'} onClick={() => setIsOpenQrModal(!isOpenQrModal)}>
                <Card className={'qr-card'}>
                  <QR value={`ton://transfer/${address}`} size={564} />
                  <span className={'icon-ic-xmark-circle-16'} />
                </Card>
              </div>
            )}
          </div>
        )}
        {activeIndex === 1 && <MinorSection isTokens address={address} />}
        {activeIndex === 2 && <MinorSection isCollectibles address={address} />}
        {activeIndex === 3 && isShowVerify && <BlockVerifyContract address={account.address} sourceData={sourceData} />}
        {activeIndex === 4 && <ContractMethods address={address} constractMethods={account?.getMethods} />}
      </AccountWrapper>
      {activeIndex === 0 && nftDetailsModel && (
        <NftDetailsPresenter
          approvedBy={nftDetailsModel.approvedBy}
          collection={nftDetailsModel.collection}
          image={nftDetailsModel.src}
          metadata={nftDetailsModel.metadata}
          owner={nftDetailsModel.owner}
          name={nftDetailsModel.name}
          verified={nftDetailsModel.verified}
        />
      )}
      {activeIndex === 0 && jettonDetailsModel && (
        <JettonDetailsPresenter
          account={jettonDetailsModel}
          balance={jettonDetailsModel}
          history={[]}
          jetton={jettonDetailsModel}
          isAccount
        />
      )}
      {activeIndex === 0 && <AccountEventsComponent accountAddress={address} data={transactions} />}
      {isViewContract && (
        <div style={{ width: '100%' }}>
          <AccountDetailsCode
            setIsLoadedCode={setIsLoadedCode}
            setIsVerifyCode={setIsVerifyCode}
            isLoadedCode={isLoadedCode}
            address={account.address}
            codeHash={codeHash}
            account={account}
            doscAsm={doscAsm}
          />
        </div>
      )}
    </Layout>
  );
};

const MainContaienrCodeSwitch = styled.div<{
  isHiddenHeader?: boolean;
  isOpenMobileBar?: boolean;
  isSimpleView?: boolean;
}>`
  display: ${props => (props.isHiddenHeader ? 'none' : 'flex')};
  background: ${props => props.theme.colors.background.card};
  margin-left: ${props => (props.isOpenMobileBar ? '274px' : '0px')};
  width: calc(100% - ${props => (props.isOpenMobileBar ? '274px' : '0px')});
  border-left: ${props => props.theme.border};
  flex-direction: column;
  border-radius: ${props => (props.isOpenMobileBar ? '0px 10px 10px' : '10px')};
  position: absolute;
  height: 100%;
  overflow-x: hidden;
  transition: 0.1s;

  .headerSwitch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: ${props => props.theme.colors.background.card};
    transition: 0.1s;

    &:last-child {
      border-radius: 0 10px 0 0 !important;
    }
  }

  ${props =>
    props.isSimpleView &&
    css`
      width: 100%;
      margin: 0px;
      height: 100vh;
      position: static;
      border: none;
      border-radius: 12px;
      background: none;
      min-height: 100vh;
    `}
`;

const ItemCodeSwitch = styled.div<{ isActive: boolean }>`
  padding: 16px 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border-left: ${props => props.theme.border};
  border-bottom: 1px solid
    ${props => (props.isActive ? props.theme.colors.text.primary : props.theme.colors.separator.default)};

  &:hover {
    opacity: ${props => (props.isActive ? '1' : '0.7')};
  }
  &:active {
    opacity: ${props => (props.isActive ? '1' : '0.5')};
  }

  &:last-child {
    border-radius: 0 10px 0 0 !important;
  }
  &:first-child {
    border-left: none !important;
  }

  @media screen and (max-width: 960px) {
    padding: 12px 14px;
  }
`;

const BytecodeContainer = styled.div<{ isScroll: boolean }>`
  overflow-x: ${props => (props.isScroll ? 'scroll' : 'hidden')};
  height: 100%;
  padding: 12px;

  @media screen and (max-width: 960px) {
    padding: 12px 24px 12px 42px !important;
  }
`;

const ItemTextAsm = styled.span<{ isFind?: boolean; Content?: string }>`
  cursor: ${props => (props.isFind ? 'pointer' : 'default')};
  color: ${props => (props?.isFind ? props.theme.colors.accent.version : props.theme.colors.text.primary)};
  position: relative;

  .tooltip-code {
    padding: 12px;
    width: 100%;
    top: 0;
    right: -312px;
    min-width: 300px;
    min-height: 30px;
    position: absolute;
    margin-bottom: 9px;
    display: none;
    background: ${props => props.theme.colors.button.buttonPrimaryBackground};
    z-index: 999;
    border-radius: 10px;
    overflow: hidden;
    color: white;
    //word-wrap: word-wrap;
    white-space: pre-line;
  }

  &:hover {
    .tooltip-code {
      display: flex;
    }
  }
`;

const Bytecode = ({ isHiddenHeader, type, isOpenMobileBar, dataAccountV2, doscAsm, isSimpleView = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cellData, setCell] = useState('');
  const [disasm, setDisasm] = useState();

  const arraySection = [
    {
      name: 'Hex',
      data: type === 'Raw data' ? dataAccountV2.data : dataAccountV2.code
    },
    {
      name: 'Cells',
      data: cellData
    },
    {
      name: 'Base64',
      data: Buffer.from(type === 'Raw data' && type ? dataAccountV2.data : dataAccountV2.code, 'hex').toString('base64')
    },
    {
      name: 'Disassembled',
      data: disasm
    }
  ];

  const getCell = () => {
    const bytecodeOrRaw = type === 'Raw data' ? String(dataAccountV2.data) : String(dataAccountV2.code);

    const hexToBytes = TonWeb.utils.hexToBytes(bytecodeOrRaw);
    const c = TonWeb.boc.Cell.oneFromBoc(hexToBytes);
    setCell(c.print());
  };

  const getDisasm = async () => {
    const bytecode = type !== 'Raw data' && type ? String(dataAccountV2.code) : '';
    const hexToBytes = TonWeb.utils.hexToBytes(bytecode);
    const codeBytesToBase64 = TonWeb.utils.bytesToBase64(hexToBytes);

    try {
      const { data } = await axios.post('https://tonapi.io/v1/boc/disassemble', {
        base64: codeBytesToBase64
      });

      if (!data?.fift) throw new Error('Fift is not defined');

      const asm = data?.fift.split(' ').map((itemAsmElem, i) => {
        if (!Array.isArray(doscAsm)) return null;

        const isFind = doscAsm.find(({ name }) => {
          return String(itemAsmElem).indexOf(name) >= 0 && itemAsmElem !== '' && name !== '';
        });

        const titleTooltip = `${isFind?.doc_stack ? `${isFind?.doc_stack}` : '-'}`;
        const subscription = `\n\n${isFind?.doc_description ? isFind?.doc_description : ''}`;
        const description = `${titleTooltip}${subscription}`;

        return (
          <ItemTextAsm key={i} isFind={isFind} Content={''}>
            {isFind && <span className={'tooltip-code'}>{description}</span>}
            {itemAsmElem !== '' ? <> {itemAsmElem}</> : <> </>}
          </ItemTextAsm>
        );
      });

      setDisasm(asm);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setActiveIndex(0);
    getCell();

    if (type === 'Bytecode' && Array.isArray(doscAsm) && !disasm) {
      getDisasm();
    }
  }, [dataAccountV2, type]);

  const wordWrap = arraySection[activeIndex].name === 'Cells' ? 'normal' : 'break-word';
  const whiteSpace =
    arraySection[activeIndex].name === 'Cells' || arraySection[activeIndex].name === 'Disassembled' ? 'pre' : 'normal';

  return (
    <MainContaienrCodeSwitch
      isSimpleView={isSimpleView}
      isHiddenHeader={isHiddenHeader}
      isOpenMobileBar={isOpenMobileBar}
    >
      <div className={'headerSwitch'}>
        {arraySection.map(({ name }, index) => {
          if (type === 'Raw data' && name === 'Disassembled') {
            return null;
          }

          return (
            <ItemCodeSwitch
              key={index + name}
              isActive={activeIndex === index}
              onClick={e => {
                e.preventDefault();
                setActiveIndex(index);
              }}
            >
              {name}
            </ItemCodeSwitch>
          );
        })}
      </div>
      <BytecodeContainer isScroll={arraySection[activeIndex].name === 'Cells'}>
        <Text style={{ wordWrap, whiteSpace }}>{arraySection[activeIndex].data}</Text>
      </BytecodeContainer>
    </MainContaienrCodeSwitch>
  );
};

const CodeContainer = styled.div`
  background: ${props => props.theme.colors.background.card};
  height: 100vh;
  border-radius: 16px;
  width: 100%;
  display: flex;

  .wrapper-animation {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .animation {
      width: 256px;
      height: 256px;
      filter: grayscale(100%);
    }
  }

  #sideBarContract {
    width: 40px;
    min-width: auto;
    height: 40px;
    padding: 0;
    position: absolute;
    top: 50px;
    left: 250px;
    background: ${props => props.theme.colors.text.secondary};
    border: none;
    opacity: 1;
    border-radius: 0 33px 33px 0;
    transition: 0.1s;
    z-index: 99;
    /* border-radius: 50%; */
  }

  #myVerifierContainer {
    width: 100%;
    border-radius: 16px;
    position: sticky;
    top: 0;
  }

  #myVerifierFiles {
    /* border-right: ${props => props.theme.colors.background.main} solid 1px; */
    background: ${props => props.theme.colors.background.card};
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 250px;
    position: relative;

    @media screen and (max-width: 768px) {
      transition: 0.1s;
    }
  }

  .myVeriferWrapper {
    padding: 20px 0 0 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #myBaytecodeWrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  #myVerifierContent {
    border-radius: 0 16px 16px 0;
    border-left: ${props => props.theme.colors.background.main} solid 1px;

    .MainContaienrCodeSwitch {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 30px;
      border-radius: 12px;
      background: ${props => props.theme.colors.background.card};

      .ItemCodeSwitch {
        padding: 16px 18px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        transition: 0.1s;

        &:hover {
          background: ${props => props.theme.colors.background.main};
        }
      }

      .active {
        background: ${props => props.theme.colors.background.main} !important;

        &:active {
          opacity: 0.5;
        }
      }
    }
  }

  .contract-verifier-file {
    background: transparent;
    border-radius: 8px 0 0 8px;
    padding: 12px 14px;
  }

  .bytecode_view {
    background: ${props => props.theme.colors.background.active};
    padding: 10px;
    width: 100%;
    border-left: ${props => props.theme.colors.background.main} solid 1px;
  }

  .contract-verifier-code {
    background: ${props => props.theme.colors.background.card} !important;
  }

  .active {
    background: ${props => props.theme.colors.background.main} !important;
  }

  .contract-verifier-file:hover {
    background: ${props => props.theme.colors.background.main} !important;
  }

  .hljs,
  .hljs-operator,
  .hljs-punctuation {
    color: ${props => props.theme.colors.text.primary} !important;
  }

  .hljs-function {
    color: ${props => (props.theme.isDarkTheme ? '#61aeee' : '#2271b3')};
  }

  .contract-verifier-code-content,
  .contract-verifier-code-lines {
    font-size: 14px;
    font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courie,
      serif;
  }

  .contract-verifier-code-lines {
    color: ${props => props.theme.colors.text.secondary} !important;
  }
`;

const apiv2Config = apiConfigV2(true);

const AccountDetailsCode = ({
  codeHash = '',
  address,
  account,
  doscAsm,
  setIsLoadedCode,
  setIsVerifyCode,
  isLoadedCode
}) => {
  const isTestnet = (process.env.host || '').includes('testnet');
  const refFiles = useRef();
  const refCode = useRef();
  const theme = useTheme();
  const { isMobile } = useIsMobile();
  const [isDark, setIsDark] = useState(theme.isDarkTheme);
  const [isOpenMobileBar, setIsOpenMobileBar] = useState(!isMobile);
  const [typeButton, setTypeButton] = useState<string | null>(null);
  const [isHiddenHeader, setIsHiddenHeader] = useState(true);
  const [, setSourceData] = useState<any>();
  const [ipfsLinkSource, setIpfsLinkSource] = useState<null | string>();
  const [sourceCode, setSourceCode] = useState(false);
  const [dataAccountV2, setDataAccountV2] = useState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buttonNames = ['Bytecode', 'Raw data'];

  const handleCode = async () => {
    try {
      const blockchainService = new BlockchainApi(apiv2Config);
      const data: any = await blockchainService.getRawAccount({ accountId: address });
      setDataAccountV2(data);

      if (codeHash === '') return;

      // eslint-disable-next-line no-undef
      const ipfslink = await ContractVerifier.getSourcesJsonUrl(codeHash, { testnet: isTestnet });
      if (!ipfslink) return;

      setIpfsLinkSource(ipfslink);

      // eslint-disable-next-line no-undef
      const sourcesData = await ContractVerifier.getSourcesData(ipfslink, { testnet: isTestnet });
      if (!sourcesData) return;

      if (data) {
        setSourceData(sourcesData);
        buttonNames.forEach(name => {
          sourcesData.files.push({
            content: '',
            isEntrypoint: false,
            name
          });
        });
      }

      // eslint-disable-next-line no-undef
      ContractVerifierUI.loadSourcesData(sourcesData, {
        containerSelector: '#myVerifierContainer',
        fileListSelector: '#myVerifierFiles',
        contentSelector: '#myVerifierContent',
        theme: theme.isDarkTheme ? 'dark' : 'light',
        hideLineNumbers: false
      });

      setSourceCode(true);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    setIsHiddenHeader(typeButton === null);
  }, [typeButton]);

  useEffect(() => {
    const isVerify = ipfsLinkSource;
    setIsVerifyCode(isVerify);
  }, [ipfsLinkSource]);

  useEffect(() => {
    handleCode().then(() => {
      setIsLoadedCode(true);
    });

    if (theme.isDarkTheme !== isDark) {
      setIsDark(theme.isDarkTheme);
      setIsHiddenHeader(true);
    }
  }, [theme, account]);

  useEffect(() => {
    setSourceCode(false);
    setIsLoadedCode(false);
    setIsVerifyCode(false);
  }, []);

  useEffect(() => {
    const elem = document.getElementsByClassName('myVeriferWrapper')[0];
    if (elem?.addEventListener) {
      elem.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        const filesElement = document.getElementById('myVerifierFiles');
        const filesContainer = filesElement?.children || [];
        const lenFilesContainer = filesContainer?.length || 0;

        for (let i = 0; i < lenFilesContainer; i++) {
          const fileButton: HTMLElement = filesContainer[i];
          const isActive = fileButton.className.indexOf('active') >= 0;
          const typeButton = fileButton.children[1].textContent;
          const isBytecode = buttonNames.some(name => typeButton === name && isActive);
          if (isBytecode) return setTypeButton(typeButton);
          else setTypeButton(null);
        }
      });
    }
  }, [buttonNames, refFiles]);

  if (theme.isDarkTheme !== isDark || !theme) {
    return null;
  }

  const fullData = ipfsLinkSource && dataAccountV2;

  return (
    <CodeContainer>
      {!isLoadedCode && (
        <div className={'wrapper-animation'}>
          <div className={'animation'}>
            <Lottie animationData={LogoAnimation} loop autoPlay />
          </div>
        </div>
      )}
      <div id="myVerifierContainer" style={{ display: fullData && isLoadedCode ? 'flex' : 'none' }}>
        <div
          className={'myVeriferWrapper'}
          style={{
            paddingLeft: isOpenMobileBar ? '24px' : '0px'
          }}
        >
          <div
            ref={refFiles}
            id="myVerifierFiles"
            style={{
              marginLeft: isOpenMobileBar ? 0 : '-274px',
              opacity: isOpenMobileBar ? '1' : '0',
              userSelect: isOpenMobileBar ? 'all' : 'none'
            }}
          />
        </div>
        {isMobile && (
          <Button
            id={'sideBarContract'}
            variant={'primary'}
            onClick={() => setIsOpenMobileBar(!isOpenMobileBar)}
            style={{ left: isOpenMobileBar ? '274px' : '0px' }}
          >
            {isOpenMobileBar ? (
              <span className={'icon icon-ic-chevron-left-20'} />
            ) : (
              <span className={'icon icon-ic-chevron-right-16 '} />
            )}
          </Button>
        )}
        <div
          id="myVerifierContent"
          ref={refCode}
          style={{ borderRadius: isOpenMobileBar ? '0px 16px 16px 0px' : '16px' }}
        />
        {dataAccountV2 && typeButton !== 'Get Methods' && (
          <Bytecode
            type={typeButton}
            isHiddenHeader={isHiddenHeader}
            isOpenMobileBar={isOpenMobileBar}
            dataAccountV2={dataAccountV2}
            doscAsm={doscAsm}
          />
        )}
      </div>
      {!ipfsLinkSource && !sourceCode && dataAccountV2 && isLoadedCode && (
        <Bytecode
          type={'Bytecode'}
          isSimpleView={true}
          isHiddenHeader={false}
          isOpenMobileBar={isOpenMobileBar}
          dataAccountV2={dataAccountV2}
          doscAsm={doscAsm}
        />
      )}
    </CodeContainer>
  );
};

export const AccountDetailsContainer: FC<AccountPageProps> = (props: any) => {
  const nftDetailsModel = useNftDetailsModel(props.nftDetails);
  const jettonDetailsModel = useJettonDetailsModel(props.jettonDetails);
  const nftListModel = useNftListModel(props.nfts);

  // Address;
  // const rawAddress = base64ToAddress(props.address);
  // useEffect(() => {
  //   const sse = new EventSource(`https://tonapi.io/v1/stream/sse/account?accounts=${rawAddress}`);
  //   sse.onmessage = (e) => {
  //     console.log(JSON.parse(e.data));
  //   };
  //   sse.addEventListener('message', (e) => {
  //     console.log(e.data);
  //   });
  // }, []);

  return (
    <AccountDetailsPresenter
      {...props}
      nftDetailsModel={nftDetailsModel}
      jettonDetailsModel={jettonDetailsModel}
      nftListModel={nftListModel}
    />
  );
};
