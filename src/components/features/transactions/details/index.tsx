import styled, { createGlobalStyle, css } from 'styled-components';
import { renderTree } from '../trace';
import React, { useState } from 'react';
import useDarkMode from 'use-dark-mode';
import { Themeable } from '../../../../types/styles';
import { Layout } from '../../../core/layout';
import OrgChartTree from '../../../core/treegraph';
import { Button } from '../../../core/button';
import { TransactionComponent } from 'tonviewer-web/components/Transaction/TransactionComponent';

const darkCodeStyles = css`
  /*!
  Theme: Dracula
  Author: Mike Barkmin (http://github.com/mikebarkmin) based on Dracula Theme (http://github.com/dracula)
  License: ~ MIT (or more permissive) [via base16-schemes-source]
  Maintainer: @highlightjs/core-team
  Version: 2021.09.0
*/
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }
  code.hljs {
    padding: 3px 5px;
  }
  .hljs {
    color: #e9e9f4;
    background: #282936;
  }
  .hljs ::selection,
  .hljs::selection {
    background-color: #4d4f68;
    color: #e9e9f4;
  }
  .hljs-comment {
    color: #626483;
  }
  .hljs-tag {
    color: #62d6e8;
  }
  .hljs-operator,
  .hljs-punctuation,
  .hljs-subst {
    color: #e9e9f4;
  }
  .hljs-operator {
    opacity: 0.7;
  }
  .hljs-bullet,
  .hljs-deletion,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-template-variable,
  .hljs-variable {
    color: #ea51b2;
  }
  .hljs-attr,
  .hljs-link,
  .hljs-literal,
  .hljs-number,
  .hljs-symbol,
  .hljs-variable.constant_ {
    color: #b45bcf;
  }
  .hljs-class .hljs-title,
  .hljs-title,
  .hljs-title.class_ {
    color: #00f769;
  }
  .hljs-strong {
    font-weight: 600;
    color: #00f769;
  }
  .hljs-addition,
  .hljs-code,
  .hljs-string,
  .hljs-title.class_.inherited__ {
    color: #ebff87;
  }
  .hljs-built_in,
  .hljs-doctag,
  .hljs-keyword.hljs-atrule,
  .hljs-quote,
  .hljs-regexp {
    color: #a1efe4;
  }
  .hljs-attribute,
  .hljs-function .hljs-title,
  .hljs-section,
  .hljs-title.function_,
  .ruby .hljs-property {
    color: #62d6e8;
  }
  .diff .hljs-meta,
  .hljs-keyword,
  .hljs-template-tag,
  .hljs-type {
    color: #b45bcf;
  }
  .hljs-emphasis {
    color: #b45bcf;
    font-style: italic;
  }
  .hljs-meta,
  .hljs-meta .hljs-keyword,
  .hljs-meta .hljs-string {
    color: #00f769;
  }
  .hljs-meta .hljs-keyword,
  .hljs-meta-keyword {
    font-weight: 600;
  }
`;

const whiteCodeStyles = css`
  /*!
  Theme: Edge Light
  Author: cjayross (https://github.com/cjayross)
  License: ~ MIT (or more permissive) [via base16-schemes-source]
  Maintainer: @highlightjs/core-team
  Version: 2021.09.0
  */
  /* eslint-disable-next-line */
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }
  code.hljs {
    padding: 3px 5px;
  }
  .hljs {
    color: #5e646f;
    background: #fafafa;
  }
  .hljs ::selection,
  .hljs::selection {
    background-color: #d69822;
    color: #5e646f;
  }
  .hljs-comment {
    color: #5e646f;
  }
  .hljs-tag {
    color: #6587bf;
  }
  .hljs-operator,
  .hljs-punctuation,
  .hljs-subst {
    color: #5e646f;
  }
  .hljs-operator {
    opacity: 0.7;
  }
  .hljs-attr,
  .hljs-bullet,
  .hljs-deletion,
  .hljs-link,
  .hljs-literal,
  .hljs-name,
  .hljs-number,
  .hljs-selector-tag,
  .hljs-symbol,
  .hljs-template-variable,
  .hljs-variable,
  .hljs-variable.constant_ {
    color: #db7070;
  }
  .hljs-class .hljs-title,
  .hljs-title,
  .hljs-title.class_ {
    color: #d69822;
  }
  .hljs-strong {
    font-weight: 600;
    color: #d69822;
  }
  .hljs-addition,
  .hljs-code,
  .hljs-string,
  .hljs-title.class_.inherited__ {
    color: #7c9f4b;
  }
  .hljs-built_in,
  .hljs-doctag,
  .hljs-keyword.hljs-atrule,
  .hljs-quote,
  .hljs-regexp {
    color: #509c93;
  }
  .hljs-attribute,
  .hljs-function .hljs-title,
  .hljs-section,
  .hljs-title.function_,
  .ruby .hljs-property {
    color: #6587bf;
  }
  .diff .hljs-meta,
  .hljs-keyword,
  .hljs-template-tag,
  .hljs-type {
    color: #b870ce;
  }
  .hljs-emphasis {
    color: #b870ce;
    font-style: italic;
  }
  .hljs-meta,
  .hljs-meta .hljs-keyword,
  .hljs-meta .hljs-string {
    color: #509c93;
  }
  .hljs-meta .hljs-keyword,
  .hljs-meta-keyword {
    font-weight: 600;
  }
`;

type GlobalStylesProps = Themeable;

export const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  ${({ darkMode }) => (darkMode ? darkCodeStyles : whiteCodeStyles)}
`;

const WrapperTrace = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;

  .traceMainLine {
    width: 2px;
    background: white;
    @media screen and (max-width: 768px) {
      margin-left: 4px;
    }
  }

  .mainTrace {
    display: flex;
    width: 100%;
    overflow: hidden;
    flex-direction: column;
  }
`;

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;

  .show-trace {
    background: ${props => props.theme.colors.background.card};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const TransactionDetailsPresenter = ({ trace, event }) => {
  const darkMode = useDarkMode();
  const [showTrace, setShowTrace] = useState(false);

  return (
    <Layout>
      <TransactionComponent event={event} />
      <WrapperContainer>
        {trace ? <OrgChartTree trace={trace} setShowTrace={setShowTrace} /> : null}
        {!showTrace && (
          <Button className={'show-trace'} variant={'primary'} onClick={() => setShowTrace(!showTrace)}>
            {!showTrace ? 'Show Trace' : 'Hide Trace'}
          </Button>
        )}
        <GlobalStyles darkMode={darkMode.value} />
        <WrapperTrace style={{ display: showTrace ? 'block' : 'none' }}>
          {trace ? renderTree(trace, 0, true) : null}
        </WrapperTrace>
      </WrapperContainer>
    </Layout>
  );
};

export const TransactionDetailsContainer = ({ event, trace }) => {
  return <TransactionDetailsPresenter event={event} trace={trace} />;
};
