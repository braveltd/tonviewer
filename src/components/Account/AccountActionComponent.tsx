import React from 'react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import { css, cx } from '@linaria/core';
import { useAccountAction, SortEventsT } from 'tonviewer-web/utils/eventsFormatter';
import { SortActionT } from 'tonviewer-web/utils/actionFormatter';
import { addressToBase64, sliceString } from 'tonviewer-web/helpers';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import { useNft } from 'tonviewer-web/utils/eventsUtils';
import { useTooltip } from 'tonviewer-web/hooks/useTooltip';
import { MenuComponent } from 'tonviewer-web/components/Account/MenuComponent';
import { Body2, Label2, NoWrapText } from 'tonviewer-web/utils/textStyles';
import IcCopy from 'tonviewer-web/assets/icons/ic-copy-outline-16.svg';
import IcDone from 'tonviewer-web/assets/icons/ic-done-16.svg';
import IcCoins from 'tonviewer-web/assets/icons/ic-coins-16.svg';
import IcGlobe from 'tonviewer-web/assets/icons/ic-globe-16.svg';
import IcArrowDown from 'tonviewer-web/assets/icons/ic-arrow-down-16.svg';
import IcArrowUp from 'tonviewer-web/assets/icons/ic-arrow-up-16.svg';
import IcArrowRight from 'tonviewer-web/assets/icons/ic-arrow-right-16.svg';

const actionContainer = css`
  display: grid;
  grid-template-columns: 100%;
`;

const actionContent = css`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-areas: 'text address comment amount';
  grid-template-columns: 20% 47% 15% 18%;
  padding: 8px 16px;

  @media (max-width: 768px) {
    background-color: var(--backgroundContent);
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

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `
);

const actionAddressContainer = css`
  overflow: hidden;
  flex: 1;
`;

const actionAddressStyle = cx(
  Label2,
  css`
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    color: var(--textAccent);
    font-family: 'SF Mono';

    &.is-same {
      color: var(--textPrimary);
    }

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
    }
  `
);

const actionAddressIcon = css`
  grid-area: address-icon;

  @media (max-width: 768px) {
    transform: rotate(90deg);
    margin-left: 65px;
  }
`;

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

    &.other {
      color: var(--textSecondary);
    }

    &.receive {
      color: var(--accentGreen);
    }
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
    <div className={cx(actionCommentContainer, commentType)} onMouseEnter={show}>
      <div className={actionCommentText}>{comment}</div>
    </div>
  );
});

interface ActionAddressComponentProps {
  name: string;
  address: string;
  transaction: SortEventsT;
}

const ActionAddressComponent = React.memo((props: ActionAddressComponentProps) => {
  const router = useRouter();
  const [isCopy, setIsCopy] = React.useState(false);

  const isSame = addressToBase64(props.transaction.account.address) === props.address;

  const handleCopy = React.useCallback(() => {
    setIsCopy(true);
    copy(props.address);
    setTimeout(() => {
      setIsCopy(false);
    }, 500);
  }, [props.address]);

  return (
    <div className={actionAddressContainer}>
      <div className={cx(actionAddressStyle, isSame && 'is-same')}>
        <div
          onClick={e => {
            if (isSame) {
              return;
            }
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
  send: <IcArrowUp />,
  receive: <IcArrowDown />,
  deposit: <IcCoins />
};

interface ActionItemProps {
  action: SortActionT;
  transaction: SortEventsT;
}

export const AccountActionComponent = React.memo((props: ActionItemProps) => {
  const { action, transaction } = props;
  const { actionIcon, actionTitle, actionAddress, actionComment, actionAmount } = useAccountAction(
    action,
    transaction.account
  );
  const { comment, commentType, payload } = actionComment;
  const { amountType, amountValue } = actionAmount;

  return (
    <div className={actionContainer}>
      <div className={actionContent}>
        <div className={cx(actionTextStyle, 'no-padding')}>
          <UIcon icon={ActionIcon[actionIcon]} />
          <div className={NoWrapText}>{actionTitle}</div>
        </div>
        <div className={cx(actionAddressContent, actionAddress.type)}>
          {actionAddress.type === 'simple' ? (
            <ActionAddressComponent
              name={actionAddress.name}
              address={actionAddress.address}
              transaction={transaction}
            />
          ) : (
            <>
              <ActionAddressComponent
                name={actionAddress.senderName}
                address={actionAddress.senderAddress}
                transaction={transaction}
              />
              <UIcon icon={<IcArrowRight />} color="var(--iconSecondary)" className={actionAddressIcon} />
              <ActionAddressComponent
                name={actionAddress.receiverName}
                address={actionAddress.receiverAddress}
                transaction={transaction}
              />
            </>
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
            <div className={cx(actionAmountText, amountValue.type)}>
              <div className={NoWrapText}>
                {`${amountValue.type === 'receive' ? '+' : amountValue.type === 'send' ? '-' : ''}${
                  amountValue.amount
                } ${amountValue.symbol}`}
              </div>
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
    </div>
  );
});
