import {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useMemo,
} from 'react';
import { UserConfig } from '@/data/types';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Nullable } from '@/types';

type UserConfigContextValue = {
  userConfig: Nullable<UserConfig>;
  configLoading: boolean;
  setUserConfig: Dispatch<SetStateAction<Nullable<UserConfig>>>;
  storeUserConfig: (config: UserConfig) => void;
};

type UserConfigProviderProps = {
  children: ReactNode;
};

export const UserConfigContext = createContext<UserConfigContextValue>(
  {} as UserConfigContextValue,
);

const UserConfigProvider: FC<UserConfigProviderProps> = ({ children }) => {
  const [userConfig, setUserConfig] = useState<Nullable<UserConfig>>(null);
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getUserConfig()
      .then(setUserConfig)
      .finally(() => {
        setConfigLoading(false);
      });
  }, [dataProvider]);

  // @TODO - consider combining store and set for consumers
  const value = useMemo(
    () => ({
      userConfig,
      configLoading,
      setUserConfig,
      storeUserConfig: dataProvider.putUserConfig.bind(dataProvider),
    }),
    [userConfig, dataProvider, configLoading],
  );

  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
};

export default UserConfigProvider;
