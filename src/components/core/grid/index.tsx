import React from 'react';
import styled, { css } from 'styled-components';

type TGridItemProps = Partial<{
  area: React.CSSProperties['gridArea']
}>

export const GridItem = styled.div<TGridItemProps>`
  display: flex;
  min-height: 32px;
  flex: 1;
`;

type TGridProps = Partial<{
  align: React.CSSProperties['alignItems']
  areas: React.CSSProperties['gridTemplateAreas']
  columns: React.CSSProperties['gridTemplateColumns']
  cgap: React.CSSProperties['columnGap']
  gap: React.CSSProperties['gap']
  justify: React.CSSProperties['justifyContent']
  rows: React.CSSProperties['gridTemplateRows']
  rgap: React.CSSProperties['rowGap']
}>

export const Grid = styled.div<TGridProps>`
  display: grid;
  flex: 1;
  ${(props) => props.align && css`align-items: ${props.align}`};
  ${(props) => props.areas && css`grid-template-areas: ${props.areas};`}
  ${(props) => props.columns && css`grid-template-columns: ${props.columns};`}
  ${(props) => props.rows && css`grid-template-rows: ${props.rows};`}
  ${(props) => props.gap && css`gap: ${props.gap};`}
  ${(props) => props.cgap && css`column-gap: ${props.cgap};`}
  ${(props) => props.rgap && css`row-gap: ${props.rgap};`}
  @media screen and (max-width: 500px) {
    column-gap: 0px;
  }
`;
