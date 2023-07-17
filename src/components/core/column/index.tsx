import React from 'react';
import styled, { css } from 'styled-components';

type TColumnProps = Partial<{
  align: React.CSSProperties['alignItems']
  cursor: React.CSSProperties['cursor']
  direction: React.CSSProperties['flexDirection']
  justify: React.CSSProperties['justifyContent']
  gap: React.CSSProperties['gap']
  fullHeight: boolean
  fullWidth: boolean
}>

export const Column = styled.div<TColumnProps>`
  display: flex;
  flex: 1;
  flex-direction: ${(props) => props.direction ?? 'column'};
  ${(props) => props.align && css`align-items: ${props.align};`}
  ${(props) => props.cursor && css`cursor: ${props.cursor};`}
  ${(props) => props.gap && css`gap: ${props.gap};`}
  ${(props) => props.justify && css`justify-content: ${props.justify};`}
  ${(props) => props.fullHeight && css`height: 100%;`}
  ${(props) => props.fullWidth && css`width: 100%;`}
`;
