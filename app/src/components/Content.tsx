import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Grid, GridProps } from '@cloudscape-design/components';
import { FC, useCallback, useEffect, useState } from 'react';
import AssistantsList from './AssistantsList';
import Chat from './Chat';
import { Assistant } from '@/data/types';
import { useDataProvider } from '@/hooks/useDataProvider';
import AssistantModalProvider from '@/context/AssistantModal';
import { Nullable } from '@/types';

const Content: FC<{}> = () => {
  const dataProvider = useDataProvider();

  const [selectedAssistant, setSelectedAssistant] =
    useState<Nullable<Assistant>>(null);

  const chooseSelectedAssistant = useCallback(
    () => dataProvider.getDefaultAssistant().then(setSelectedAssistant),
    [dataProvider],
  );

  useEffect(() => {
    chooseSelectedAssistant();
  }, [chooseSelectedAssistant]);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> =
    selectedAssistant
      ? [{ colspan: { default: 4, s: 3 } }, { colspan: { default: 8, s: 9 } }]
      : [{ colspan: { default: 4, s: 3 } }];

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
    </ContentLayout>
  );
};

export default Content;
