import { Event, ValueFlow, AccountAddress, ActionTypeEnum } from 'tonapi-sdk-js';
import { addressToBase64, convertNanoton } from 'tonviewer-web/helpers';
import { prettifyPrice } from 'tonviewer-web/helpers/numbers';
import { actionFormatter, SortActionT } from 'tonviewer-web/utils/actionFormatter';

export type SortEventT = {
  eventId: string;
  timestamp: number;
  valueFlow: ValueFlow[];
  isScam: boolean;
  lt: number;
  inProgress: boolean;
  actions: SortActionT[];
};

type ActionIconT = 'globe' | 'token' | 'nft' | 'ton';

const getActionIcon = (action: SortActionT): ActionIconT => {
  if (
    action.type === ActionTypeEnum.Subscribe ||
    action.type === ActionTypeEnum.UnSubscribe ||
    action.type === ActionTypeEnum.ContractDeploy ||
    action.type === ActionTypeEnum.SmartContractExec
  ) {
    return 'globe';
  } else if (
    action.type === ActionTypeEnum.TonTransfer ||
    action.type === ActionTypeEnum.DepositStake ||
    action.type === ActionTypeEnum.RecoverStake
  ) {
    return 'ton';
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    return 'token';
  } else if (
    action.type === ActionTypeEnum.NftItemTransfer ||
    action.type === ActionTypeEnum.AuctionBid ||
    action.type === ActionTypeEnum.NftPurchase
  ) {
    return 'nft';
  } else {
    return 'globe';
  }
};

const getActionTitle = (action: SortActionT) => {
  if (action.type === ActionTypeEnum.Subscribe) {
    return 'Subscribe';
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    return 'Unsubscribe';
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    return 'Transfer TON';
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    return 'Transfer token';
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    return 'Transfer NFT';
  } else if (action.type === ActionTypeEnum.ContractDeploy) {
    return 'Contract deploy';
  } else if (action.type === ActionTypeEnum.AuctionBid) {
    return 'Bid';
  } else if (action.type === ActionTypeEnum.NftPurchase) {
    return 'NFT Purchase';
  } else if (action.type === ActionTypeEnum.DepositStake) {
    return 'Deposit stake';
  } else if (action.type === ActionTypeEnum.RecoverStake) {
    return 'Recover stake';
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    return 'Call Contract';
  } else {
    return action.simplePreview.name;
  }
};

type ActionAddressT =
  | {
      address: string;
      name?: string;
      type: 'simple';
    }
  | {
      senderAddress: string;
      receiverAddress: string;
      senderName?: string;
      receiverName?: string;
      type: 'other';
    };

const sortAddress = (sender: AccountAddress, receiver: AccountAddress): ActionAddressT => {
  return {
    senderAddress: addressToBase64(sender.address),
    senderName: sender.name,
    receiverAddress: addressToBase64(receiver.address),
    receiverName: receiver.name,
    type: 'other'
  };
};

const getActionAddress = (action: SortActionT): ActionAddressT => {
  if (action.type === ActionTypeEnum.Subscribe) {
    const { beneficiary, subscriber } = action.event;
    return sortAddress(subscriber, beneficiary);
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    const { beneficiary, subscriber } = action.event;
    return sortAddress(subscriber, beneficiary);
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient);
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient);
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient);
  } else if (action.type === ActionTypeEnum.AuctionBid) {
    const { bidder, beneficiary } = action.event;
    return sortAddress(bidder, beneficiary);
  } else if (action.type === ActionTypeEnum.NftPurchase) {
    const { buyer, seller } = action.event;
    return sortAddress(buyer, seller);
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    const { executor, contract } = action.event;
    return sortAddress(executor, contract);
  } else if (action.type === ActionTypeEnum.ContractDeploy) {
    return {
      address: addressToBase64(action.event.address),
      type: 'simple'
    };
  } else {
    if (action.simplePreview.accounts.length > 1) {
      return sortAddress(action.simplePreview.accounts[0], action.simplePreview.accounts[1]);
    } else {
      return {
        address: addressToBase64(action.simplePreview.accounts[0].address),
        type: 'simple'
      };
    }
  }
};

type CommentResT = {
  comment: string | null;
  commentType: 'comment' | 'operation';
  payload: string | null;
};

const getActionComment = (action: SortActionT): CommentResT => {
  if (
    action.type === ActionTypeEnum.TonTransfer ||
    action.type === ActionTypeEnum.JettonTransfer ||
    action.type === ActionTypeEnum.NftItemTransfer
  ) {
    return {
      comment: action.event.comment,
      commentType: 'comment',
      payload: null
    };
  } else if (
    action.type === ActionTypeEnum.Subscribe ||
    action.type === ActionTypeEnum.AuctionBid ||
    action.type === ActionTypeEnum.UnSubscribe ||
    action.type === ActionTypeEnum.ContractDeploy
  ) {
    return {
      comment: null,
      commentType: 'comment',
      payload: null
    };
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    return {
      comment: action.event.operation,
      commentType: 'operation',
      payload: action.event.payload
    };
  } else {
    return {
      comment: action.simplePreview.description,
      commentType: 'comment',
      payload: null
    };
  }
};

type AmountResT =
  | {
      amountType: 'fiat-transfer';
      amountValue: {
        amount: string | null;
        symbol: string | null;
      };
    }
  | {
      amountType: 'nft-transfer';
      amountValue: {
        nftAddress: string;
      };
    }
  | {
      amountType: 'nft-purchase';
      amountValue: {
        amount: string | null;
        nftPreview: string | null;
      };
    };

const convertAmount = (amount: number | string) => prettifyPrice(convertNanoton(amount));

const getActionAmount = (action: SortActionT): AmountResT => {
  if (action.type === ActionTypeEnum.Subscribe) {
    const { amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON'
      }
    };
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: '-',
        symbol: ''
      }
    };
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    const { amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON'
      }
    };
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    const { amount, jetton } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: jetton.symbol
      }
    };
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    const { nft } = action.event;
    return {
      amountType: 'nft-transfer',
      amountValue: {
        nftAddress: nft
      }
    };
  } else if (action.type === ActionTypeEnum.ContractDeploy) {
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: '-',
        symbol: ''
      }
    };
  } else if (action.type === ActionTypeEnum.AuctionBid) {
    const { amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount.value),
        symbol: amount.tokenName
      }
    };
  } else if (action.type === ActionTypeEnum.NftPurchase) {
    const { nft, amount } = action.event;
    return {
      amountType: 'nft-purchase',
      amountValue: {
        amount: convertAmount(amount.value),
        nftPreview: nft.previews.length ? nft.previews.find(i => i.resolution === '100x100').url : null
      }
    };
  } else if (action.type === ActionTypeEnum.DepositStake) {
    const { amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON'
      }
    };
  } else if (action.type === ActionTypeEnum.RecoverStake) {
    const { amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON'
      }
    };
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    const { tonAttached } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(tonAttached),
        symbol: 'TON'
      }
    };
  } else {
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: '-',
        symbol: ''
      }
    };
  }
};

export const eventFormatter = (event: Event): SortEventT => {
  return {
    ...event,
    actions: event.actions.map(i => actionFormatter(i))
  };
};

export const useTransactionAction = (action: SortActionT) => {
  const actionIcon = getActionIcon(action);
  const actionTitle = getActionTitle(action);
  const actionAddress = getActionAddress(action);
  const actionComment = getActionComment(action);
  const actionAmount = getActionAmount(action);

  return {
    actionIcon,
    actionTitle,
    actionAddress,
    actionComment,
    actionAmount
  };
};
