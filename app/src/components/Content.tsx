import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Box, Button, Grid, GridProps } from '@cloudscape-design/components';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import AssistantsList from './AssistantsList';
import Chat from './Chat';
import { UserConfig } from '@/data/types';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import AssistantModalProvider from '@/context/AssistantModal';
import { Nullable } from '@/types';
import { UserConfigContext } from '@/context/UserConfig';
import ConfigModal from './ConfigModal/ConfigModal';

const Content: FC = () => {
  const [configModalVisible, setConfigModalVisible] = useState<boolean>(false);
  const storageProvider = useStorageProvider();
  const { userConfig, setUserConfig, storeUserConfig, configLoading } =
    useContext(UserConfigContext);

  const assistants = useLiveQuery(
    () => storageProvider.getAssistants(),
    [storageProvider],
    [],
  );

  const [selectedAssistantId, setSelectedAssistantId] =
    useState<Nullable<string>>();

  const chooseSelectedAssistant = useCallback(async () => {
    const id = await storageProvider.getDefaultAssistantId();
    setSelectedAssistantId(id ?? assistants[0]?.id);
  }, [storageProvider]);

  const selectedAssistant = assistants.find(
    (a) => a.id === selectedAssistantId,
  );

  console.log({ selectedAssistant, selectedAssistantId });

  useEffect(() => {
    chooseSelectedAssistant();
  }, [chooseSelectedAssistant]);

  useEffect(() => {
    if (!configLoading && !userConfig?.apiKey) {
      setConfigModalVisible(true);
    }
  }, [userConfig?.apiKey, configLoading]);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> =
    selectedAssistantId
      ? [
          {
            colspan: {
              default: 4,
              s: 3,
            },
          },
          {
            colspan: {
              default: 8,
              s: 9,
            },
          },
        ]
      : [
          {
            colspan: {
              default: 4,
              s: 3,
            },
          },
        ];

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
          <AssistantsList
            onSelectedAssistantIdChange={setSelectedAssistantId}
            selectedAssistantId={selectedAssistantId}
            assistants={assistants}
          />
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
