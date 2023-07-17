import {
  Action,
  ActionSimplePreview,
  ActionTypeEnum,
  AuctionBidAction,
  ContractDeployAction,
  DepositStakeAction,
  JettonTransferAction,
  NftItemTransferAction,
  NftPurchaseAction,
  RecoverStakeAction,
  SmartContractAction,
  SubscriptionAction,
  TonTransferAction,
  UnSubscriptionAction
} from 'tonapi-sdk-js';

export type SortActionT =
  | { event: SubscriptionAction; simplePreview: ActionSimplePreview; type: 'Subscribe' }
  | { event: UnSubscriptionAction; simplePreview: ActionSimplePreview; type: 'UnSubscribe' }
  | { event: TonTransferAction; simplePreview: ActionSimplePreview; type: 'TonTransfer' }
  | { event: JettonTransferAction; simplePreview: ActionSimplePreview; type: 'JettonTransfer' }
  | { event: NftItemTransferAction; simplePreview: ActionSimplePreview; type: 'NftItemTransfer' }
  | { event: ContractDeployAction; simplePreview: ActionSimplePreview; type: 'ContractDeploy' }
  | { event: AuctionBidAction; simplePreview: ActionSimplePreview; type: 'AuctionBid' }
  | { event: NftPurchaseAction; simplePreview: ActionSimplePreview; type: 'NftPurchase' }
  | { event: DepositStakeAction; simplePreview: ActionSimplePreview; type: 'DepositStake' }
  | { event: RecoverStakeAction; simplePreview: ActionSimplePreview; type: 'RecoverStake' }
  | { event: SmartContractAction; simplePreview: ActionSimplePreview; type: 'SmartContractExec' }
  | { simplePreview: ActionSimplePreview; type: 'Unknown' };

export const actionFormatter = (action: Action): SortActionT => {
  if (action.type === ActionTypeEnum.Subscribe) {
    return {
      type: ActionTypeEnum.Subscribe,
      event: action.subscribe!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.UnSubscribe) {
    return {
      type: ActionTypeEnum.UnSubscribe,
      event: action.unSubscribe!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.TonTransfer) {
    return {
      type: ActionTypeEnum.TonTransfer,
      event: action.tonTransfer!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.JettonTransfer) {
    return {
      type: ActionTypeEnum.JettonTransfer,
      event: action.jettonTransfer!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.NftItemTransfer) {
    return {
      type: ActionTypeEnum.NftItemTransfer,
      event: action.nftItemTransfer!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.ContractDeploy) {
    return {
      type: ActionTypeEnum.ContractDeploy,
      event: action.contractDeploy!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.AuctionBid) {
    return {
      type: ActionTypeEnum.AuctionBid,
      event: action.auctionBid!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.NftPurchase) {
    return {
      type: ActionTypeEnum.NftPurchase,
      event: action.nftPurchase!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.DepositStake) {
    return {
      type: ActionTypeEnum.DepositStake,
      event: action.depositStake!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.RecoverStake) {
    return {
      type: ActionTypeEnum.RecoverStake,
      event: action.recoverStake!,
      simplePreview: action.simplePreview
    };
  } else if (action.type === ActionTypeEnum.SmartContractExec) {
    return {
      type: ActionTypeEnum.SmartContractExec,
      event: action.smartContractExec!,
      simplePreview: action.simplePreview
    };
  } else {
    return {
      type: ActionTypeEnum.Unknown,
      simplePreview: action.simplePreview
    };
  }
};
