import React, { PropsWithChildren } from 'react';
import { withDataProvider } from '@/hooks/useDataProvider';
import { DataProvider } from '@/data';

const dataProvider = new DataProvider();

export const WithProviders: React.FC<PropsWithChildren> = ({ children }) => withDataProvider(children, dataProvider);
