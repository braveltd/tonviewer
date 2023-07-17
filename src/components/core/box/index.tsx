import isNil from 'lodash/isNil';
import React from 'react';
import styled, { css } from 'styled-components';

type TBoxProps = Partial<{
  rounded: boolean
  squared: boolean
  bg: React.CSSProperties['background']
  bottom: React.CSSProperties['bottom']
  cursor: React.CSSProperties['cursor']
  height: React.CSSProperties['height']
  left: React.CSSProperties['left']
  overFlowX: React.CSSProperties['overflowX']
  overFlowY: React.CSSProperties['overflowY']
  minWidth: React.CSSProperties['minWidth']
  maxWidth: React.CSSProperties['maxWidth']
  opacity: React.CSSProperties['opacity']
  position: React.CSSProperties['position']
  right: React.CSSProperties['right']
  visibility: React.CSSProperties['visibility']
  top: React.CSSProperties['top']
  width: React.CSSProperties['width']
  zIndex: React.CSSProperties['zIndex']
}>

export const Box = styled.div<TBoxProps>`
  ${(props) => props.rounded && css`
    border-radius: ${props.squared ? '7px' : '50%'};
    overflow: hidden;
  `}
  ${(props) => props.bg && css`background: ${props.bg};`}
  ${(props) => !isNil(props.bottom) && css`bottom: ${props.bottom};`}
  ${(props) => props.cursor && css`cursor: ${props.cursor};`}
  ${(props) => props.height && css`height: ${props.height};`}
  ${(props) => props.overFlowX && css`overflow-x: ${props.overFlowX};`}
  ${(props) => props.overFlowY && css`overflow-y: ${props.overFlowY};`}
  ${(props) => !isNil(props.left) && css`left: ${props.left};`}
  ${(props) => props.minWidth && css`min-width: ${props.minWidth};`}
  ${(props) => props.maxWidth && css`max-width: ${props.maxWidth};`}
  ${(props) => props.opacity && css`opacity: ${props.opacity};`}
  ${(props) => props.position && css`position: ${props.position};`}
  ${(props) => !isNil(props.right) && css`right: ${props.right};`}
  ${(props) => props.visibility && css`visibility: ${props.visibility};`}
  ${(props) => !isNil(props.top) && css`top: ${props.top};`}
  ${(props) => props.width && css`width: ${props.width};`}
  ${(props) => props.zIndex && css`z-index: ${props.zIndex};`}
`;
