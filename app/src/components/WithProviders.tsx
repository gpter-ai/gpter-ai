import React, { PropsWithChildren } from 'react';
import { withDataProvider } from '@/hooks/useDataProvider';
import { MockDataProvider } from '@/data/mock/MockDataProvider';
import { MockstorageProvider } from '@/data/mock/MockStorageProvider';

const storageProvider = new MockstorageProvider();
const dataProvider = new MockDataProvider(storageProvider);

export const WithProviders: React.FC<PropsWithChildren> = ({ children }) =>
  withDataProvider(children, dataProvider);
