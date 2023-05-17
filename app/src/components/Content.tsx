import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
  Box,
  Button,
  Grid,
  GridProps,
  Toggle,
} from '@cloudscape-design/components';
import { FC, useContext, useEffect, useState } from 'react';
import AssistantsPane from './AssistantsPane';
import Chat from './Chat';
import { Assistant, UserConfig } from '@/data/types';
import AssistantModalProvider from '@/context/AssistantModal';
import { Nullable } from '@/types';
import { UserConfigContext } from '@/context/UserConfig';
import ConfigModal from './ConfigModal/ConfigModal';
import { useAssistants } from '@/hooks/useAssistants';
import HelpModal from './HelpModal';

const Content: FC = () => {
  const [configModalVisible, setConfigModalVisible] = useState<boolean>(false);
  const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);
  const { userConfig, setUserConfig, storeUserConfig, configLoading } =
    useContext(UserConfigContext);

  const { assistants } = useAssistants();

  const [selectedAssistantId, setSelectedAssistantId] =
    useState<Nullable<string>>();

  const selectedAssistant: Nullable<Assistant> =
    assistants.find((a) => a.id === selectedAssistantId) ?? assistants[0];

  useEffect(() => {
    if (!configLoading && !userConfig?.apiKey) {
      setConfigModalVisible(true);
    }
  }, [userConfig?.apiKey, configLoading]);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> =
    selectedAssistant
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

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('awsui-dark-mode');
    } else {
      document.body.classList.remove('awsui-dark-mode');
    }
  }, [darkMode]);

  const headerActions = (
    <SpaceBetween direction="horizontal" size="xs">
      <Button onClick={() => setDarkMode((dm) => !dm)}>
        <Toggle checked={darkMode}>Dark mode</Toggle>
      </Button>
      <Button
        iconName="settings"
        onClick={(): void => {
          setConfigModalVisible(true);
        }}
      >
        Configure
      </Button>
      <Button
        iconName="status-info"
        onClick={(): void => {
          setHelpModalVisible(true);
        }}
      >
        Help
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
          <AssistantsPane
            onSelectedAssistantIdChange={setSelectedAssistantId}
            selectedAssistantId={selectedAssistant?.id}
            assistants={assistants}
          />
          {selectedAssistant && <Chat assistant={selectedAssistant} />}
        </Grid>
      </AssistantModalProvider>
      <ConfigModal
        initValues={userConfig || {}}
        visible={configModalVisible}
        onConfirm={onConfigModalConfirm}
      />
      <HelpModal visible={helpModalVisible} setVisible={setHelpModalVisible} />
    </ContentLayout>
  );
};

export default Content;
