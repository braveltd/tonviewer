import React from 'react';
import styled, { css } from 'styled-components';

type TRowProps = Partial<{
  align: React.CSSProperties['alignItems']
  aself: React.CSSProperties['alignSelf']
  cursor: React.CSSProperties['cursor']
  justify: React.CSSProperties['justifyContent']
  gap: React.CSSProperties['gap']
  wrap: React.CSSProperties['flexWrap']
  fullHeight: boolean
  fullWidth: boolean
}>

export const Row = styled.div<TRowProps>`
  display: flex;
  flex-direction: row;
  ${(props) => props.align && css`align-items: ${props.align};`}
  ${(props) => props.aself && css`align-self: ${props.aself};`}
  ${(props) => props.cursor && css`cursor: ${props.cursor};`}
  ${(props) => props.gap && css`gap: ${props.gap};`}
  ${(props) => props.justify && css`justify-content: ${props.justify};`}
  ${(props) => props.wrap && css`flex-wrap: ${props.wrap};`}
  ${(props) => props.fullHeight && css`height: 100%;`}
  ${(props) => props.fullWidth && css`width: 100%;`}
`;
