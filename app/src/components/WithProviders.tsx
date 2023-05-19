import React, { PropsWithChildren } from 'react';
import { withStorageProvider } from '@/hooks/useStorageProvider';
import { KeysProvider } from '@/hooks/useKeysProvider';
import { IndexedStorageProvider } from '@/data/indexedDB/IndexedStorageProvider';
import UserConfigProvider from '@/context/UserConfig';
import { AssistantsProvider } from '@/hooks/useAssistantsProvider';

const storageProvider = new IndexedStorageProvider();

export const WithProviders: React.FC<PropsWithChildren> = ({ children }) =>
  withStorageProvider({
    component: (
      <UserConfigProvider>
        <AssistantsProvider>
          <KeysProvider>{children}</KeysProvider>
        </AssistantsProvider>
      </UserConfigProvider>
    ),
    storageProvider,
  });
