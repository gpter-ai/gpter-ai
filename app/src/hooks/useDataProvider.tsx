import React, { FC, ReactNode, useContext } from 'react';
import { DataProvider } from '@/data';
import { assertNonNullable } from '@/utils/asserts';

type Props = { component: ReactNode; dataProvider: DataProvider };

const DataProviderContext = React.createContext<DataProvider | undefined>(
  undefined,
);

export const withDataProvider: FC<Props> = ({ component, dataProvider }) => (
  <DataProviderContext.Provider value={dataProvider}>
    {component}
  </DataProviderContext.Provider>
);

export const useDataProvider = (): DataProvider => {
  const dataProvider = useContext(DataProviderContext);

  assertNonNullable(dataProvider);
  return dataProvider;
};
