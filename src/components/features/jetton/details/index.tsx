import styled from 'styled-components';
import { Avatar, Breadcrumbs, Metadata } from '../../../index';
import { AccountEvent, Account, JettonBalance, JettonInfo } from 'tonapi-sdk-js';
import React, { FC } from 'react';
import { Card } from '../../../core/card';
import { Text, TitleH4 } from '../../../core/text';
import capitalize from 'lodash/capitalize';
import { Layout } from '../../../core/layout';
import { AppRoutes } from '../../../../helpers/routes';
import { getAddressHalfLength, usePrettyAddress, useWidth } from '../../../../helpers/hooks';
import { prettifyPrice } from '../../../../helpers/numbers';
import { Copy } from '../../../core/copy';
import { addressToBase64, formatAddress } from '../../../../helpers';
import { AccountSection, AccountWrapper } from '../../accounts/details';
import { useIsMobile } from '@farfetch/react-context-responsive';
import { JettonEventsComponent } from 'tonviewer-web/components/Account/AccountEventsComponent';
import { isDomain } from 'tonviewer-web/helpers/isDomain';

const useSliceStr = (addr: string, coef = 30) => {
  const width = useWidth();

  const h = getAddressHalfLength(width, coef);

  if (isDomain(addr) && addr.length < h) return addr;
  return h < addr.length / 2 ? `${addr.slice(0, h)}…${addr.slice(addr.length - h, addr.length)}` : addr;
};

export type JettonDetailsPresenterProps = {
  account: Account;
  history: AccountEvent[];
  balance: JettonBalance;
  jetton: JettonInfo;
  isAccount?: boolean;
};

const WrapperTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const JettonDetailsPresenter: FC<JettonDetailsPresenterProps> = ({
  account,
  jetton,
  balance,
  history,
  isAccount
}) => {
  const { isMobile } = useIsMobile();
  const bast64Address = addressToBase64(jetton.metadata.address);
  const jettonAddress = useSliceStr(bast64Address, 60);
  const ownerAddress = usePrettyAddress(account.address);
  const decimals = parseFloat(jetton.metadata.decimals) ?? 9;
  const price = parseFloat(balance.balance) / 10 ** decimals;
  const supply = parseFloat(jetton.totalSupply) / 10 ** decimals;

  if (isAccount) {
    return (
      <>
        <AccountWrapper>
          <div className={'accountInfoWrapper'} style={{ flexDirection: 'row' }}>
            {!isMobile && (
              <div className={'avatar-wrapper account-avatar'}>
                <Avatar
                  src={jetton.metadata?.image}
                  alt={jetton.metadata?.name}
                  size={jetton.metadata?.name === '' ? 40 : 80}
                />
              </div>
            )}
            <div className={'accountInfo'}>
              {isMobile ? (
                <WrapperTitle>
                  <Avatar src={jetton.metadata?.image} alt={jetton.metadata?.name} size={24} />
                  {jetton.metadata?.name !== '' && <TitleH4>{jetton.metadata?.name}</TitleH4>}
                </WrapperTitle>
              ) : (
                jetton.metadata?.name !== '' && <TitleH4>{jetton.metadata?.name}</TitleH4>
              )}

              <div className={'jetton-info-grid min'}>
                <AccountSection subtitle={'Max. supply'}>
                  <Text className={'l2'}>
                    {prettifyPrice(supply)} {jetton.metadata?.symbol.split(' ')[0] || ''}
                  </Text>
                </AccountSection>
                <AccountSection subtitle={'Mintable'}>
                  <Text className={'l2'}>{capitalize(String(jetton.mintable))}</Text>
                </AccountSection>
              </div>
              {jetton.metadata.description && jetton.metadata.description !== '' && (
                <AccountSection subtitle={'Description'}>
                  <Text className={'b2'}>{jetton.metadata.description}</Text>
                </AccountSection>
              )}
            </div>
          </div>
        </AccountWrapper>
        <Card>
          <Text className={'l1'}>Metadata</Text>
          <Metadata metadata={jetton.metadata} />
        </Card>
      </>
    );
  }

  return (
    <Layout>
      <Breadcrumbs
        className="nospace"
        items={[
          { name: 'Explorer', link: AppRoutes.home() },
          {
            name: account.name || ownerAddress,
            link: AppRoutes.accountDetails(account.address)
          },
          { name: jetton.metadata?.name }
        ]}
      />
      <AccountWrapper>
        <div className={'accountInfoWrapper'} style={{ flexDirection: 'row' }}>
          {!isMobile && (
            <div className={'avatar-wrapper'}>
              <Avatar src={jetton.metadata?.image} alt={jetton.metadata?.name} size={80} />
            </div>
          )}
          <div className={'accountInfo'}>
            {isMobile ? (
              <WrapperTitle>
                <Avatar src={jetton.metadata?.image} alt={jetton.metadata?.name} size={24} />
                <TitleH4>{jetton.metadata?.name}</TitleH4>
              </WrapperTitle>
            ) : (
              <TitleH4>{jetton.metadata?.name}</TitleH4>
            )}

            <div className={'jetton-info-grid'}>
              <AccountSection subtitle={'Balance in wallet'}>
                <Text className={'l2'}>
                  {prettifyPrice(price)} {jetton.metadata?.name}
                </Text>
              </AccountSection>
              <AccountSection subtitle={'Address'}>
                <Copy textToCopy={addressToBase64(jetton.metadata?.address)}>
                  <Text className={'l2'} type={'history-address'}>
                    {isMobile ? jettonAddress : formatAddress(bast64Address, 8)}
                  </Text>
                </Copy>
              </AccountSection>
              <AccountSection subtitle={'Max. supply'}>
                <Text className={'l2'}>
                  {prettifyPrice(supply)} {jetton.metadata?.symbol || ''}
                </Text>
              </AccountSection>
              <AccountSection subtitle={'Mintable'}>
                <Text className={'l2'}>{capitalize(String(jetton.mintable))}</Text>
              </AccountSection>
            </div>
            <AccountSection subtitle={'Description'}>
              <Text className={'b2'}>{jetton.metadata.description}</Text>
            </AccountSection>
          </div>
        </div>
      </AccountWrapper>
      <Card>
        <Text className={'l1'}>Metadata</Text>
        <Metadata metadata={jetton.metadata} />
      </Card>
      {!isAccount && <JettonEventsComponent events={history} />}
    </Layout>
  );
};
