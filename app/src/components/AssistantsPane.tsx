import { FC, useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container } from '@cloudscape-design/components';
import { Assistant } from '@/data/types';
import { Nullable } from '@/types';
import ChooseAssistantModal from './ChooseAssistantModal';

import './AssistantsPane.scss';

type Props = {
  onSelectedAssistantIdChange: (id: string) => void;
  selectedAssistantId: Nullable<string>;
  assistants: Assistant[];
};

const AssistantsPane: FC<Props> = ({
  onSelectedAssistantIdChange,
  selectedAssistantId,
  assistants,
}) => {
  const [assistantSelectionModalVisible, setAssistantSelectionModalVisible] =
    useState<boolean>(false);

  return (
    <Container>
      <SpaceBetween direction="vertical" size="m">
        <div className="assistantsPaneButtonWrapper">
          <Button
            iconName="add-plus"
            onClick={() => setAssistantSelectionModalVisible(true)}
            variant="link"
          >
            Get New Assistant
          </Button>
        </div>
        {assistants.length > 0 && <hr />}
        {assistants.map((assistant) => (
          <div key={assistant.id} className="assistantsPaneButtonWrapper">
            <Button
              onClick={() => onSelectedAssistantIdChange(assistant.id)}
              variant={
                assistant.id === selectedAssistantId ? 'primary' : 'normal'
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
