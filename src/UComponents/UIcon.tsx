import React from 'react';
import { css, cx } from '@linaria/core';

export type UIconSize = 'small' | 'medium' | 'large' | 'xlarge';

type IconSizesRecord = {
  size: number;
};

const BoxSizes: {
  [key in UIconSize]: IconSizesRecord;
} = {
  small: { size: 12 },
  medium: { size: 16 },
  large: { size: 20 },
  xlarge: { size: 24 }
};

const IconSizes: {
  [key in UIconSize]: IconSizesRecord;
} = {
  small: { size: 12 },
  medium: { size: 16 },
  large: { size: 20 },
  xlarge: { size: 24 }
};

const icon = css`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  width: var(--size);
  height: var(--size);

  & svg {
    pointer-events: none;
    width: var(--icon-size);
    height: var(--icon-size);
    & > path {
      fill: var(--fill-color);
      stroke: var(--stroke-color);
    }
  }

  &.action {
    cursor: pointer;
  }
`;

export interface UIconProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  size?: UIconSize;
  color?: string;
  strokeColor?: string;
}

export const UIcon = React.forwardRef((props: UIconProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { size = 'medium', color = 'var(--iconPrimary)', strokeColor = 'transparent', style } = props;
  const boxSizes = BoxSizes[size];
  const iconSizes = IconSizes[size];
  const boxSize = boxSizes.size;
  const iconSize = iconSizes.size;
  return (
    <div
      ref={ref}
      onClick={props.onClick}
      className={cx(icon, !!props.onClick && 'action', props.className, 'icon-content')}
      style={
        {
          '--size': boxSize + 'px',
          '--icon-size': iconSize + 'px',
          '--fill-color': color,
          '--stroke-color': strokeColor,
          ...style
        } as React.CSSProperties
      }
    >
      {props.icon}
    </div>
  );
});
