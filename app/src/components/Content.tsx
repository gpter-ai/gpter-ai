import * as React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Grid, GridProps } from '@cloudscape-design/components';
import AssistantsList from './AssistantsList';
import Chat from './Chat';

const Content = () => {
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
      <Grid gridDefinition={gridDefinition}>
        <AssistantsList />
        <Chat />
      </Grid>
    </ContentLayout>
  );
};

export default Content;
