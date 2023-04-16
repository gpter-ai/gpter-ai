import React, { ReactNode, useContext } from 'react';
import { DataProvider } from '@/data';
import { assertNonNullable } from '@/utils/asserts';

const DataProviderContext = React.createContext<DataProvider | undefined>(
  undefined,
);

export const withDataProvider = (
  component: ReactNode,
  dataProvider: DataProvider,
) => (
  <DataProviderContext.Provider value={dataProvider}>
    {component}
  </DataProviderContext.Provider>
);

export const useDataProvider = (): DataProvider => {
  const dataProvider = useContext(DataProviderContext);

  assertNonNullable(dataProvider);
  return dataProvider;
};
