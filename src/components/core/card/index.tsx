import React from 'react';
import styled, { css } from 'styled-components';

type TCardProps = Partial<{
  height: React.CSSProperties['height']
  radius: 'small' | 'medium'
  isScroller?: boolean
  widthContent?: number
  isHistory?: boolean
}>

export const Card = styled.div<TCardProps>`
  background-color: ${(props) => props.theme.colors.background.card};
  border-radius: ${(props) => {
    return props.radius === 'small'
      ? props.theme.borderRadius.small
      : props.theme.borderRadius.medium;
  }};
  ${(props) => css`height: ${props.height};`}
  padding: ${(props) => `20px ${props.theme.spacing.large}`};
  width: ${(props) => `${props.isScroller && props?.widthContent > 0 ? `${props.widthContent}px` : '100%;'}`};
`;

export const CardHistory = styled.div<TCardProps>`
  //background-color: ${(props) => props.theme.colors.background.card};
  border-radius: ${(props) => {
  return props.radius === 'small'
      ? props.theme.borderRadius.small
      : props.theme.borderRadius.medium;
  }};
  ${(props) => css`height: ${props.height};`}
  //padding: ${(props) => `20px ${props.theme.spacing.large}`};
  width: ${(props) => `${props.isScroller && props?.widthContent > 0 ? `${props.widthContent}px` : '100%;'}`};
`;
