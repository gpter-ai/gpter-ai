import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Box, Grid } from '@cloudscape-design/components';
import { FC, useContext, useEffect, useState } from 'react';
import AssistantsPane from './AssistantsPane';
import Chat from './Chat';
import { UserConfig } from '@/data/types';
import AssistantModalProvider from '@/context/AssistantModal';
import { UserConfigContext } from '@/context/UserConfig';
import ConfigModal from './ConfigModal/ConfigModal';
import HelpModal from './HelpModal';
import HeaderActions from './HeaderActions';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';

const Content: FC = () => {
  const [configModalVisible, setConfigModalVisible] = useState<boolean>(false);
  const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);
  const { userConfig, setUserConfig, storeUserConfig, configLoading } =
    useContext(UserConfigContext);

  const { selectedAssistant } = useAssistantsProvider();

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
          <AssistantsPane />
          {selectedAssistant && <Chat />}
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
