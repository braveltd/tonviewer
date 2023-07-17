import React from 'react';
import styled, { css } from 'styled-components';

export type TFontFamily = 'monospace' | 'sans-serif'

export type TTextProps = Partial<{
  align: React.CSSProperties['textAlign']
  bold: boolean
  color: React.CSSProperties['color']
  cursor: React.CSSProperties['cursor']
  fontFamily: TFontFamily
  indent: React.CSSProperties['textIndent']
  ls: React.CSSProperties['letterSpacing']
  lineHeight: React.CSSProperties['lineHeight']
  size: React.CSSProperties['fontSize']
  wb: React.CSSProperties['wordBreak']
  ws: React.CSSProperties['whiteSpace']
  transform: React.CSSProperties['textTransform']
  isAddress?: boolean
  isTime?: boolean
}>

export const fontFamily = css<TTextProps>`
  font-family: ${props => props.theme.font.family.serif};

  ${(props) => props.fontFamily === 'monospace' && css`
    font-family: ${props.theme.font.family.monospace};
  `};
`;

type TSubtitleProps = TTextProps & Partial<{
  color: React.CSSProperties['color']
  isAlignStart?: boolean
}>

export const Subtitle = styled.h3<TSubtitleProps>`
  color: ${(props) => props.color ?? props.theme.colors.text.primary};
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  width: 100%;
  text-align: ${props => props.isAlignStart ? 'start' : 'center'};
  margin: 0;
  ${fontFamily};

  @media screen and (max-width: 500px) {
    text-align: start;
  }
`;

type TypeText = 'history-address' | 'default'

export const TitleH1 = styled.h1`
  color: ${(props) => props.theme.colors.text.primary};
`;
export const TitleH2 = styled.h2`
  color: ${(props) => props.theme.colors.text.primary};
`;
export const TitleH4 = styled.h4`
  color: ${(props) => props.theme.colors.text.primary};
`;
export const Text = styled.span<{type?: TypeText}>`
  ${props => props.type === 'history-address' && css`
    color: ${(props) => props.theme.colors.text.accent};
  `}

  ${props => !props.type && css`
    color: ${(props) => props.theme.colors.text.primary};
  `}
`;
export const SecondaryText = styled(Text)`
  color: ${(props) => props.theme.colors.text.secondary};
`;
