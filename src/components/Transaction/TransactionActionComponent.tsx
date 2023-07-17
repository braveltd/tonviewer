import React from 'react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import { css, cx } from '@linaria/core';
import { useTransactionAction } from 'tonviewer-web/utils/transactionFormatter';
import { SortActionT } from 'tonviewer-web/utils/actionFormatter';
import { sliceString } from 'tonviewer-web/helpers';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { useNft } from 'tonviewer-web/utils/eventsUtils';
import { useTooltip } from 'tonviewer-web/hooks/useTooltip';
import { MenuComponent } from 'tonviewer-web/components/Account/MenuComponent';
import { Body2, Label2, NoWrapText } from 'tonviewer-web/utils/textStyles';
import IcCopy from 'tonviewer-web/assets/icons/ic-copy-outline-16.svg';
import IcDone from 'tonviewer-web/assets/icons/ic-done-16.svg';
import IcCoins from 'tonviewer-web/assets/icons/ic-coins-16.svg';
import IcGlobe from 'tonviewer-web/assets/icons/ic-globe-16.svg';
import IcTon from 'tonviewer-web/assets/icons/ic-ton-16.svg';
import IcNft from 'tonviewer-web/assets/icons/ic-gear-16.svg';
import IcArrowRight from 'tonviewer-web/assets/icons/ic-arrow-right-16.svg';

const actionContent = css`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-areas: 'text address comment amount';
  grid-template-columns: 17% 38% 27% 18%;
  padding: 8px 16px;

  @media (max-width: 1000px) {
    grid-template-columns: 22% 35% 25% 18%;
  }

  @media (max-width: 768px) {
    grid-template-areas: 'text text amount' 'address address address' 'comment comment comment';
    grid-template-columns: 50%;
    padding: 8px 0;
  }
`;

const actionItemStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    padding: 0 16px 0 40px;
    &.no-padding {
      padding: 0 16px;
    }
  }
`;

const actionTextStyle = cx(
  Label2,
  actionItemStyle,
  css`
    grid-area: text;
    color: var(--textPrimary);
    gap: 8px;
  `
);

const actionAddressContent = cx(
  actionItemStyle,
  css`
    grid-area: address;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    gap: 8px;
  `
);

const actionAddressContainer = css`
  overflow: hidden;
  flex: 1;
`;

const actionAddressStyle = cx(
  Label2,
  css`
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    color: var(--textAccent);
    font-family: 'SF Mono';

    & .copy-icon {
      opacity: 0;
    }

    &:hover .copy-icon {
      opacity: 1;
    }

    @media (max-width: 768px) {
      & .copy-icon {
        opacity: 1;
      }
      &.address-2 {
        justify-content: flex-end;
      }
    }
  `
);

const actionCommentContainer = cx(
  actionItemStyle,
  css`
    grid-area: comment;
    overflow: hidden;

    &.comment {
      color: var(--textPrimary);
    }

    &.operation {
      color: var(--textSecondary);
    }

    &.empty {
      color: var(--textSecondary);
      opacity: 0.3;
    }

    @media (max-width: 768px) {
      padding-top: 4px;
      pointer-events: none;
      &.comment,
      &.operation {
        color: var(--textPrimary);
        opacity: 1;
      }
      &.empty {
        display: none;
      }
    }
  `
);

const actionCommentText = cx(
  Body2,
  NoWrapText,
  css`
    @media (max-width: 768px) {
      padding: 4px 8px;
      background-color: var(--backgroundContentTint);
      border-radius: 4px 8px 8px 8px;
    }
  `
);

const actionAmountContainer = cx(
  actionItemStyle,
  css`
    grid-area: amount;
    justify-content: flex-end;
    flex: 1;
    gap: 8px;
    min-width: 0;
  `
);

const actionAmountText = cx(
  Label2,
  css`
    overflow: hidden;
    color: var(--textPrimary);
  `
);

const nftImage = css`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-top: -2px;
  margin-bottom: -2px;
`;

interface PayloadCommentProps {
  comment: string;
  commentType: 'operation' | 'comment';
  payload: string;
}

const PayloadComment = React.memo((props: PayloadCommentProps) => {
  const { comment, commentType, payload } = props;

  const [show] = useTooltip({
    placement: 'top-start',
    content: () => (
      <MenuComponent
        data={[
          {
            title: commentType,
            text: comment
          },
          {
            ...(payload && {
              title: 'Payload',
              text: payload
            })
          }
        ]}
      />
    )
  });

  return (
    <div className={cx(actionCommentContainer, commentType)}>
      <div className={actionCommentText} onMouseEnter={show}>
        {comment}
      </div>
    </div>
  );
});

interface ActionAddressComponentProps {
  name: string;
  address: string;
  className: string;
}

const ActionAddressComponent = React.memo((props: ActionAddressComponentProps) => {
  const router = useRouter();
  const [isCopy, setIsCopy] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    setIsCopy(true);
    copy(props.address);
    setTimeout(() => {
      setIsCopy(false);
    }, 500);
  }, [props.address]);

  return (
    <div className={actionAddressContainer}>
      <div className={cx(actionAddressStyle, props.className)}>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/${props.address}`);
          }}
          className={NoWrapText}
        >
          {props.name || sliceString(props.address)}
        </div>
        <UIcon
          icon={isCopy ? <IcDone /> : <IcCopy />}
          color={isCopy ? 'var(--accentGreen)' : 'var(--iconSecondary)'}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleCopy();
          }}
          className="copy-icon"
        />
      </div>
    </div>
  );
});

const NftComponent = React.memo((props: { nftAddress: string }) => {
  const nft = useNft(props.nftAddress);
  if (!nft) {
    return null;
  }
  return (
    <>
      <div className={actionAmountText}>
        <div className={NoWrapText}>{nft.name}</div>
      </div>
      {!!nft.img && <img src={nft.img} className={nftImage} />}
    </>
  );
});

const ActionIcon = {
  globe: <IcGlobe />,
  token: <IcCoins />,
  nft: <IcNft />,
  ton: <IcTon />
};

interface ActionItemProps {
  action: SortActionT;
}

export const TransactionActionComponent = React.memo((props: ActionItemProps) => {
  const { action } = props;
  const { actionIcon, actionTitle, actionAddress, actionComment, actionAmount } = useTransactionAction(action);
  const { comment, commentType, payload } = actionComment;
  const { amountType, amountValue } = actionAmount;

  return (
    <div className={actionContent}>
      <div className={cx(actionTextStyle, 'no-padding')}>
        <UIcon icon={ActionIcon[actionIcon]} />
        <div className={NoWrapText}>{actionTitle}</div>
      </div>
      <div className={actionAddressContent}>
        {actionAddress.type === 'other' ? (
          <>
            <ActionAddressComponent
              name={actionAddress.senderName}
              address={actionAddress.senderAddress}
              className="address-1"
            />
            <UIcon icon={<IcArrowRight />} color="var(--iconSecondary)" />
            <ActionAddressComponent
              name={actionAddress.receiverName}
              address={actionAddress.receiverAddress}
              className="address-2"
            />
          </>
        ) : (
          <ActionAddressComponent name={actionAddress.name} address={actionAddress.address} className="address-1" />
        )}
      </div>
      {!!comment ? (
        <PayloadComment comment={comment} commentType={commentType} payload={payload} />
      ) : (
        <div className={cx(actionCommentContainer, 'empty')}>
          <div className={actionCommentText}>{'(No comment)'}</div>
        </div>
      )}
      <div className={actionAmountContainer}>
        {amountType === 'fiat-transfer' && (
          <div className={actionAmountText}>
            <div className={NoWrapText}>{`${amountValue.amount} ${amountValue.symbol}`}</div>
          </div>
        )}
        {amountType === 'nft-purchase' && (
          <>
            <div className={actionAmountText}>
              <div className={NoWrapText}>{amountValue.amount} TON</div>
            </div>
            {!!amountValue.nftPreview && (
              <>
                <div>•</div>
                <img src={amountValue.nftPreview} className={nftImage} />
              </>
            )}
          </>
        )}
        {amountType === 'nft-transfer' && <NftComponent nftAddress={amountValue.nftAddress} />}
      </div>
    </div>
  );
});
