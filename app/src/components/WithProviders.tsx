import React, { PropsWithChildren } from 'react';
import { withDataProvider } from '@/hooks/useDataProvider';
import { MockDataProvider } from '@/data/mock/MockDataProvider';
import { IndexedStorageProvider } from '@/data/indexedDB/IndexedStorageProvider';
import UserConfigProvider from '@/context/UserConfig';

const storageProvider = new IndexedStorageProvider();
const dataProvider = new MockDataProvider(storageProvider);

export const WithProviders: React.FC<PropsWithChildren> = ({ children }) =>
  withDataProvider({
    component: <UserConfigProvider>{children}</UserConfigProvider>,
    dataProvider,
  });
