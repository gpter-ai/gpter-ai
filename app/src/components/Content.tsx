import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Grid, GridProps } from '@cloudscape-design/components';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import AssistantsList from './AssistantsList';
import Chat from './Chat';
import { Assistant } from '@/data/types';
import { useDataProvider } from '@/hooks/useDataProvider';
import AssistantModalProvider from '@/context/AssistantModal';
import { Nullable } from '@/types';
import { UserConfigContext } from '@/context/UserConfig';
import ApiKeyModal from './ApiKeyModal';

const Content: FC<{}> = () => {
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState<boolean>(false);
  const dataProvider = useDataProvider();
  const { userConfig, setUserConfig, storeUserConfig, configLoading } =
    useContext(UserConfigContext);

  const [selectedAssistant, setSelectedAssistant] =
    useState<Nullable<Assistant>>(null);

  const chooseSelectedAssistant = useCallback(
    () => dataProvider.getDefaultAssistant().then(setSelectedAssistant),
    [dataProvider],
  );

  useEffect(() => {
    chooseSelectedAssistant();
  }, [chooseSelectedAssistant]);

  useEffect(() => {
    if (!configLoading && !userConfig?.apiKey) {
      setApiKeyModalVisible(true);
    }
  }, [userConfig?.apiKey, configLoading]);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> =
    selectedAssistant
      ? [{ colspan: { default: 4, s: 3 } }, { colspan: { default: 8, s: 9 } }]
      : [{ colspan: { default: 4, s: 3 } }];

  const onApiKeyModalConfirm = (apiKey: string): void => {
    // eslint-disable-next-line prefer-object-spread
    const newConfig = Object.assign({}, userConfig, { apiKey });
    setUserConfig(newConfig);
    storeUserConfig(newConfig);
    setApiKeyModalVisible(false);
  };

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header variant="h1">GPTer</Header>
        </SpaceBetween>
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
      <ApiKeyModal
        visible={apiKeyModalVisible}
        onConfirm={onApiKeyModalConfirm}
      />
    </ContentLayout>
  );
};

export default Content;
