import React, { FC, ReactNode, useContext } from 'react';
import { assertNonNullable } from '@/utils/asserts';
import { StorageProvider } from '@/data/StorageProvider';

type Props = { component: ReactNode; storageProvider: StorageProvider };

const StorageProviderContext = React.createContext<StorageProvider | undefined>(
  undefined,
);

export const withStorageProvider: FC<Props> = ({
  component,
  storageProvider,
}) => (
  <StorageProviderContext.Provider value={storageProvider}>
    {component}
  </StorageProviderContext.Provider>
);

export const useStorageProvider = (): StorageProvider => {
  const storageProvider = useContext(StorageProviderContext);

  assertNonNullable(storageProvider);
  return storageProvider;
};
