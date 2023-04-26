import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Box, Button, Grid, GridProps } from '@cloudscape-design/components';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import AssistantsList from './AssistantsList';
import Chat from './Chat';
import { Assistant, UserConfig } from '@/data/types';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import AssistantModalProvider from '@/context/AssistantModal';
import { Nullable } from '@/types';
import { UserConfigContext } from '@/context/UserConfig';
import ConfigModal from './ConfigModal/ConfigModal';

const Content: FC<{}> = () => {
  const [configModalVisible, setConfigModalVisible] = useState<boolean>(false);
  const storageProvider = useStorageProvider();
  const { userConfig, setUserConfig, storeUserConfig, configLoading } =
    useContext(UserConfigContext);

  const [selectedAssistant, setSelectedAssistant] =
    useState<Nullable<Assistant>>(null);

  const chooseSelectedAssistant = useCallback(
    () => storageProvider.getDefaultAssistant().then(setSelectedAssistant),
    [storageProvider],
  );

  useEffect(() => {
    chooseSelectedAssistant();
  }, [chooseSelectedAssistant]);

  useEffect(() => {
    if (!configLoading && !userConfig?.apiKey) {
      setConfigModalVisible(true);
    }
  }, [userConfig?.apiKey, configLoading]);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> =
    selectedAssistant
      ? [{ colspan: { default: 4, s: 3 } }, { colspan: { default: 8, s: 9 } }]
      : [{ colspan: { default: 4, s: 3 } }];

  const onConfigModalConfirm = (config: Partial<UserConfig>): void => {
    // eslint-disable-next-line prefer-object-spread
    const newConfig = Object.assign({}, userConfig, config);
    setUserConfig(newConfig);
    storeUserConfig(newConfig);
    setConfigModalVisible(false);
  };

  const headerActions = (
    <SpaceBetween direction="horizontal" size="xs">
      <Button
        iconName="settings"
        onClick={(): void => {
          setConfigModalVisible(true);
        }}
      >
        Configure
      </Button>
    </SpaceBetween>
  );

  return (
    <ContentLayout
      header={
        <Box margin={{ top: 'm' }}>
          <SpaceBetween size="m">
            <Header actions={headerActions} variant="h1">
              GPTer
            </Header>
          </SpaceBetween>
        </Box>
      }
    >
      <AssistantModalProvider>
        <Grid gridDefinition={gridDefinition}>
          <AssistantsList setSelectedAssistant={setSelectedAssistant} />
          {selectedAssistant && (
            <Chat
              chooseSelectedAssistant={chooseSelectedAssistant}
              assistant={selectedAssistant}
            />
          )}
        </Grid>
      </AssistantModalProvider>
      <ConfigModal
        initValues={userConfig || {}}
        visible={configModalVisible}
        onConfirm={onConfigModalConfirm}
      />
    </ContentLayout>
  );
};

export default Content;
