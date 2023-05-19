import React, { FC, useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container, Header } from '@cloudscape-design/components';
import ChooseAssistantModal from './ChooseAssistantModal';

import './AssistantsPane.scss';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';

const AssistantsPane: FC<object> = () => {
  const [assistantSelectionModalVisible, setAssistantSelectionModalVisible] =
    useState<boolean>(false);

  const { assistants, selectedAssistant, selectAssistantById } =
    useAssistantsProvider();

  return (
    <Container header={<Header>Assistants</Header>}>
      <SpaceBetween direction="vertical" size="m">
        <div className="assistantsPaneButtonWrapper">
          <Button
            iconName="add-plus"
            onClick={() => setAssistantSelectionModalVisible(true)}
            variant="link"
          >
            Add New Assistant
          </Button>
        </div>
        {assistants.length > 0 && <hr />}
        {assistants.map((assistant) => (
          <div key={assistant.id} className="assistantsPaneButtonWrapper">
            <Button
              onClick={() => selectAssistantById(assistant.id)}
              variant={
                assistant.id === selectedAssistant?.id ? 'primary' : 'normal'
              }
            >
              <Box textAlign="center" color="inherit">
                {assistant.name}
              </Box>
            </Button>
          </div>
        ))}
      </SpaceBetween>
      <ChooseAssistantModal
        visible={assistantSelectionModalVisible}
        setVisible={setAssistantSelectionModalVisible}
      />
    </Container>
  );
};

export default AssistantsPane;
