import * as React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container } from '@cloudscape-design/components';
import { useDataProvider } from '@/hooks/useDataProvider';

const AssistantsList = () => {
  const dataProvider = useDataProvider();

  const assistants = dataProvider.getAssistants();

  return (
    <Container>
      <SpaceBetween direction="vertical" size="m">
        {assistants.map((assistant) => (
          <Box textAlign="center">
            <Button>{assistant.name}</Button>
          </Box>
        ))}
      </SpaceBetween>
    </Container>
  );
};

export default AssistantsList;
