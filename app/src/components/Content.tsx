import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Grid, GridProps } from '@cloudscape-design/components';
import { useState } from 'react';
import AssistantsList from './AssistantsList';
import Chat from './Chat';
import { Assistant } from '@/data/types';
import { useDataProvider } from '@/hooks/useDataProvider';
import AssistantModalProvider from '@/context/AssistantModal';

const Content = () => {
  const dataProvider = useDataProvider();
  const defaultAssistant = dataProvider.getDefaultAssistant();

  const [selectedAssistant, setSelectedAssistant] =
    useState<Assistant>(defaultAssistant);

  const gridDefinition: ReadonlyArray<GridProps.ElementDefinition> = [
    { colspan: { default: 4, s: 3 } },
    { colspan: { default: 8, s: 9 } },
  ];

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
          <Chat assistant={selectedAssistant} />
        </Grid>
      </AssistantModalProvider>
    </ContentLayout>
  );
};

export default Content;
