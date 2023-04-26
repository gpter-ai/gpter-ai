import React, { PropsWithChildren } from 'react';
import { withStorageProvider } from '@/hooks/useStorageProvider';
import { IndexedStorageProvider } from '@/data/indexedDB/IndexedStorageProvider';
import UserConfigProvider from '@/context/UserConfig';

const storageProvider = new IndexedStorageProvider();

export const WithProviders: React.FC<PropsWithChildren> = ({ children }) =>
  withStorageProvider({
    component: <UserConfigProvider>{children}</UserConfigProvider>,
    storageProvider,
  });
