import React from 'react';
import styled, { css } from 'styled-components';

type TSpacerProps = Partial<{
  m: React.CSSProperties['margin']
  mx: React.CSSProperties['marginRight'] | React.CSSProperties['marginLeft']
  my: React.CSSProperties['marginTop'] | React.CSSProperties['marginBottom']
  mt: React.CSSProperties['marginTop']
  mr: React.CSSProperties['marginRight']
  mb: React.CSSProperties['marginBottom']
  ml: React.CSSProperties['marginLeft']
  p: React.CSSProperties['padding']
  px: React.CSSProperties['paddingRight'] | React.CSSProperties['paddingLeft']
  py: React.CSSProperties['paddingTop'] | React.CSSProperties['paddingBottom']
  pt: React.CSSProperties['paddingTop']
  pr: React.CSSProperties['paddingRight']
  pb: React.CSSProperties['paddingBottom']
  pl: React.CSSProperties['paddingLeft']
  fullHeight: boolean
  fullWidth: boolean
}>

export const Spacer = styled.div<TSpacerProps>`
  ${(props) => props.m && css`margin: ${props.m};`}
  ${(props) => props.mx && css`margin: 0 ${props.mx};`}
  ${(props) => props.my && css`margin: ${props.my} 0;`}
  ${(props) => props.mt && css`margin-top: ${props.mt};`}
  ${(props) => props.mr && css`margin-right: ${props.mr};`}
  ${(props) => props.mb && css`margin-bottom: ${props.mb};`}
  ${(props) => props.ml && css`margin-left: ${props.ml};`}
  ${(props) => props.p && css`padding: ${props.p};`}
  ${(props) => props.px && css`
    padding-left: ${props.px};
    padding-right: ${props.px};
  `}
  ${(props) => props.py && css`
    padding-bottom: ${props.py};
    padding-top: ${props.py};
  `}
  ${(props) => props.pt && css`padding-top: ${props.pt};`}
  ${(props) => props.pr && css`padding-right: ${props.pr};`}
  ${(props) => props.pb && css`padding-bottom: ${props.pb};`}
  ${(props) => props.pl && css`padding-left: ${props.pl};`}
  ${(props) => props.fullHeight && css`height: 100%;`}
  ${(props) => props.fullWidth && css`width: 100%;`}
  display: flex;
  flex-direction: column;
`;
