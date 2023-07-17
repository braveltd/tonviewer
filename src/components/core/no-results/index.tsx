import React from 'react';
import styled from 'styled-components';
import { Layout } from '../layout';
import { SecondaryText, Text, TitleH2 } from '../text';
import { Button } from '../button';

const WrapperNoResult = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 80px 0px 100px 0px;

  .info-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .button-home-page {
    margin-top: 40px;
    background: ${props => props.theme.colors.background.card};

    .l2 {
      cursor: pointer;
    }
  }
`;

export const NoResultsPresenter = () => {
  return (
    <Layout>
      <WrapperNoResult>
        <div className={'info-container'}>
          <TitleH2>Sorry, didn&apos;t find any result</TitleH2>
          <SecondaryText>Make sure your request is correct and repeat the search.</SecondaryText>
        </div>
        <Button
          variant={'primary'}
          className={'button-home-page'}
          onClick={() => {
            window.location.href = '/';
          }}
        >
          <Text className={'l2'}>Go to homepage</Text>
        </Button>
      </WrapperNoResult>
    </Layout>
  );
};
