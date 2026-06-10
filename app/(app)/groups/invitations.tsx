import React from 'react';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { InvitationsInbox } from '../../../src/components/groups/InvitationsInbox';
import { router } from 'expo-router';

export default function InvitationsScreen() {

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'left', 'right']}>
      <Header title='Invitations' leading='back' onLeadingPress={close} />

      <InvitationsInbox />
    </Screen>
  );
}
