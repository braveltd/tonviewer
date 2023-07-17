import { AccountEvent, AccountAddress, ActionTypeEnum } from 'tonapi-sdk-js';
import { addressToBase64, convertNanoton } from 'tonviewer-web/helpers';
import { prettifyPrice } from 'tonviewer-web/helpers/numbers';
import { actionFormatter, SortActionT } from 'tonviewer-web/utils/actionFormatter';

export type SortEventsT = {
  eventId: string;
  account: AccountAddress;
  timestamp: number;
  isScam: boolean;
  lt: number;
  inProgress: boolean;
  extra: number;
  actions: SortActionT[];
};

type ActionIconT = 'globe' | 'send' | 'receive' | 'deposit';

const getActionIcon = (action: SortActionT, account: AccountAddress): ActionIconT => {
  if (
    action.type === ActionTypeEnum.Subscribe ||
    action.type === ActionTypeEnum.UnSubscribe ||
    action.type === ActionTypeEnum.ContractDeploy ||
    action.type === ActionTypeEnum.SmartContractExec
  ) {
    return 'globe';
  } else if (
    action.type === ActionTypeEnum.TonTransfer ||
    action.type === ActionTypeEnum.JettonTransfer ||
    action.type === ActionTypeEnum.NftItemTransfer
  ) {
    const isReceive = action.event.recipient.address === account.address;
    return isReceive ? 'receive' : 'send';
  } else if (
    action.type === ActionTypeEnum.NftPurchase ||
    action.type === ActionTypeEnum.DepositStake ||
    action.type === ActionTypeEnum.RecoverStake ||
    action.type === ActionTypeEnum.AuctionBid
  ) {
    return 'deposit';
  } else {
    return 'globe';
  }
};

const getActionTitle = (action: SortActionT, account: AccountAddress) => {
  if (action.type === ActionTypeEnum.Subscribe) {
    return action.event.initial ? 'Subscribe payment' : 'Subscribe';
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    return 'Unsubscribe';
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    const isReceive = action.event.recipient.address === account.address;
    return isReceive ? 'Received TON' : 'Sent TON';
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    const isReceive = action.event.recipient.address === account.address;
    return isReceive ? 'Received token' : 'Send token';
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    const { sender } = action.event;
    const isReceive = action.event.recipient.address === account.address;
    return !sender ? 'NFT mint' : isReceive ? 'Received NFT' : 'Send NFT';
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

const sortAddress = (sender: AccountAddress, receiver: AccountAddress, account: AccountAddress): ActionAddressT => {
  const isSelf = sender.address === receiver.address && sender.address === account.address;
  const isOther = sender.address !== account.address && receiver.address !== account.address;
  if (isSelf) {
    return {
      address: addressToBase64(account.address),
      name: account.name,
      type: 'simple'
    };
  }
  if (isOther) {
    return {
      senderAddress: addressToBase64(sender.address),
      senderName: sender.name,
      receiverAddress: addressToBase64(receiver.address),
      receiverName: receiver.name,
      type: 'other'
    };
  }
  const isReceive = receiver.address === account.address;
  return {
    address: isReceive ? addressToBase64(sender.address) : addressToBase64(receiver.address),
    name: isReceive ? sender.name : receiver.name,
    type: 'simple'
  };
};

const getActionAddress = (action: SortActionT, account: AccountAddress): ActionAddressT => {
  if (action.type === ActionTypeEnum.Subscribe) {
    const { beneficiary, subscriber } = action.event;
    return sortAddress(subscriber, beneficiary, account);
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    const { beneficiary, subscriber } = action.event;
    return sortAddress(subscriber, beneficiary, account);
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient, account);
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient, account);
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    const { sender, recipient } = action.event;
    return sortAddress(sender, recipient, account);
  } else if (action.type === ActionTypeEnum.ContractDeploy) {
    return {
      address: addressToBase64(action.event.address),
      name: undefined,
      type: 'simple'
    };
  } else if (action.type === ActionTypeEnum.AuctionBid || action.type === ActionTypeEnum.NftPurchase) {
    return {
      address: addressToBase64(action.event.nft.address),
      name: undefined,
      type: 'simple'
    };
  } else if (action.type === ActionTypeEnum.DepositStake || action.type === ActionTypeEnum.RecoverStake) {
    return {
      address: addressToBase64(action.event.staker.address),
      name: action.event.staker.name,
      type: 'simple'
    };
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    const { contract, executor } = action.event;
    return sortAddress(contract, executor, account);
  } else {
    return {
      address: addressToBase64(action.simplePreview.accounts[0].address),
      name: action.simplePreview.accounts[0].name,
      type: 'simple'
    };
  }
};

type CommentResT = {
  comment: string | null;
  commentType: 'comment' | 'operation';
  payload: string | null;
};

const getActionComment = (action: SortActionT, account: AccountAddress): CommentResT => {
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

type AmountTypeT = 'send' | 'receive' | 'static' | 'other';

type AmountResT =
  | {
      amountType: 'fiat-transfer';
      amountValue: {
        type: AmountTypeT;
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

const getAmountType = (sender: string, receiver: string, account: string): AmountTypeT => {
  const isSelf = sender === receiver && sender === account;
  const isOther = sender !== account && receiver !== account;
  if (isSelf) {
    return 'static';
  }
  if (isOther) {
    return 'other';
  }
  const isReceive = receiver === account;
  return isReceive ? 'receive' : 'send';
};

const getActionAmount = (action: SortActionT, account: AccountAddress): AmountResT => {
  if (action.type === ActionTypeEnum.Subscribe) {
    const { beneficiary, subscriber } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(action.event.amount),
        symbol: 'TON',
        type: getAmountType(subscriber.address, beneficiary.address, account.address)
      }
    };
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: '-',
        symbol: '',
        type: 'static'
      }
    };
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    const { recipient, sender, amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON',
        type: getAmountType(sender.address, recipient.address, account.address)
      }
    };
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    const { recipient, sender, amount, jetton } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: jetton.symbol,
        type: getAmountType(sender.address, recipient.address, account.address)
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
        symbol: '',
        type: 'static'
      }
    };
  } else if (action.type === ActionTypeEnum.AuctionBid) {
    const { beneficiary, bidder, amount } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount.value),
        symbol: amount.tokenName,
        type: getAmountType(bidder.address, beneficiary.address, account.address)
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
  } else if (action.type === ActionTypeEnum.DepositStake || action.type === ActionTypeEnum.RecoverStake) {
    const { staker, amount } = action.event;
    const isReceive = staker.address !== account.address;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(amount),
        symbol: 'TON',
        type: isReceive ? 'receive' : 'send'
      }
    };
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    const { tonAttached, executor, contract } = action.event;
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: convertAmount(tonAttached),
        symbol: 'TON',
        type: getAmountType(executor.address, contract.address, account.address)
      }
    };
  } else {
    return {
      amountType: 'fiat-transfer',
      amountValue: {
        amount: '-',
        symbol: '',
        type: 'static'
      }
    };
  }
};

export const eventsFormatter = (events: AccountEvent[]) => {
  const res: SortEventsT[] = [];

  for (const event of events) {
    const sortActions: SortActionT[] = [];
    for (const action of event.actions) {
      sortActions.push(actionFormatter(action));
    }
    res.push({
      ...event,
      actions: sortActions
    });
  }

  return res;
};

export const useAccountAction = (action: SortActionT, account: AccountAddress) => {
  const actionIcon = getActionIcon(action, account);
  const actionTitle = getActionTitle(action, account);
  const actionAddress = getActionAddress(action, account);
  const actionComment = getActionComment(action, account);
  const actionAmount = getActionAmount(action, account);

  return {
    actionIcon,
    actionTitle,
    actionAddress,
    actionComment,
    actionAmount
  };
};
