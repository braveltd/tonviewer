import React from 'react';
import { Account, AccountEvents } from 'tonapi-sdk-js';
import { Layout } from 'tonviewer-web/components/core/layout';
import { AccountProfileComponent } from 'tonviewer-web/components/Account/AccountProfileComponent';
import { AccountEventsComponent } from 'tonviewer-web/components/Account/AccountEventsComponent';

export interface AccountFragmentProps {
  account: Account;
  events: AccountEvents;
  balanceUSD: number;
}

export const AccountFragment = React.memo((props: AccountFragmentProps) => {
  return (
    <Layout>
      <AccountProfileComponent account={props.account} balanceUSD={props.balanceUSD} />
      <AccountEventsComponent accountAddress={props.account.address} data={props.events} />
    </Layout>
  );
});
