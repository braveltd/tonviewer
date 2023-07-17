import React from 'react';
import { css, cx } from '@linaria/core';
import { HitItem } from './GlobalSearchController';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import IcClose from 'tonviewer-web/assets/icons/ic-xmark-16.svg';
import IcTime from 'tonviewer-web/assets/icons/ic-time-16.svg';

const container = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden;
  width: 100%;
  top: calc(100% + 16px);
  padding: 16px;
  border: 1px solid var(--separatorCommon);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(21, 25, 49, 0.06);
  background-color: var(--globalInputHoverBackground);
  z-index: 1;

  &.headed {
    padding: 0;
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const itemStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;

  &.active,
  &:hover {
    background-color: var(--backgroundContentTint);
  }

  &.headed {
    border-radius: 0;
  }

  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

const leftContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  gap: 12px;
`;

const textContainer = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const textStyle = css`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const titleStyle = cx(
  textStyle,
  css`
    color: var(--textPrimary);
  `
);

const descriptionStyle = cx(
  textStyle,
  css`
    color: var(--textSecondary);
  `
);

type Props = {
  items: HitItem[];
  type: 'remote' | 'local';
  onClick: (i: HitItem) => void;
  onDelete?: (i: HitItem) => void;
  activeIndex: number;
  inHead?: boolean;
};

export const HitsPopup = React.memo((props: Props) => {
  return (
    <div className={cx(container, props.inHead && 'headed')}>
      {props.items.map((i, j) => (
        <div
          key={i.address + j}
          className={cx(itemStyle, props.inHead && 'headed', props.activeIndex === j && 'active')}
          onClick={() => props.onClick(i)}
        >
          <div className={leftContent}>
            {props.type === 'local' && <UIcon icon={<IcTime />} color="var(--iconSecondary)" />}
            <div className={textContainer}>
              {props.type === 'remote' && <div className={titleStyle}>{i.name}</div>}
              <div className={cx(props.type === 'local' ? titleStyle : descriptionStyle)}>{i.name || i.address}</div>
            </div>
          </div>
          {props.type === 'local' && (
            <UIcon
              icon={<IcClose />}
              color="var(--iconSecondary)"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.onDelete) {
                  props.onDelete(i);
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
});
