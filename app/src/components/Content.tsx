import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Box, Grid } from '@cloudscape-design/components';
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
import HeaderActions from './HeaderActions';

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

  const gridDefinition = [
    {
      colspan: {
        s: 4,
      },
    },
    {
      colspan: {
        s: 8,
      },
    },
  ];

  const onConfigModalConfirm = (config: UserConfig): void => {
    const newConfig = { ...userConfig, ...config };
    setUserConfig(newConfig);
    storeUserConfig(newConfig);
    setConfigModalVisible(false);
  };

  return (
    <ContentLayout
      header={
        <Box margin={{ top: 'm' }}>
          <SpaceBetween size="m">
            <Header
              actions={
                <HeaderActions
                  setConfigModalVisible={setConfigModalVisible}
                  setHelpModalVisible={setHelpModalVisible}
                />
              }
              variant="h1"
            >
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
