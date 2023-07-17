/* eslint no-unused-vars: 0 */
// https://github.com/typescript-eslint/typescript-eslint/issues/2621

import { Account } from 'tonapi-sdk-js';

export type Nullable<T> = T | null;

export type VoidCallback = () => void;

export type Option = {
  label: string | number
  value: string | number
}

export enum AccountInterfaces {
  NftSale = 'nft_sale',
  NftEditable = 'nft_editable',
  Domain = 'domain',
  NftCollection = 'tep62_collection',
  Subscription = 'subscription',
  WalletV1R1 = 'wallet_v1R1',
  Auction = 'auction',
  WalletV2R1 = 'wallet_v2R1',
  WalletV3R1 = 'wallet_v3R1',
  CodeUpgradable = 'code_upgradable',
  WalletV4 = 'wallet_v4',
  JettonMaster = 'tep74',
  NftItem = 'tep62_item',
  WalletV1R3 = 'wallet_v1R3',
  WalletV1R2 = 'wallet_v1R2',
  NftSaleGetGems = 'nft_sale_get_gems',
  WalletV3R2 = 'wallet_v3R2',
  CodeMaybeUpgradable = 'code_maybe_upgradable',
  WalletV4R1 = 'wallet_v4R1',
  WalletV4R2 = 'wallet_v4R2',
  NftRoyalty = 'nft_royalty',
  Wallet = 'wallet',
  DnsResolver = 'dns_resolver',
  WalletV2R2 = 'wallet_v2R2',
  JettonWallet = 'jetton_wallet',
  StakingTF = 'tf_nominator',
  StakingW = 'whales_nominators'
}

export const hasInterface = (account: Account, accountInterface: AccountInterfaces) => {
  return account.interfaces?.includes(accountInterface);
};
