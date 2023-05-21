import { FC, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Container, Header } from '@cloudscape-design/components';
import ChooseAssistantModal from './ChooseAssistantModal';

import './AssistantsPane.scss';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import DraggableAssistant from './DraggableAssistant';

const AssistantsPane: FC<object> = () => {
  const [assistantSelectionModalVisible, setAssistantSelectionModalVisible] =
    useState<boolean>(false);

  const { assistants } = useAssistantsProvider();

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
        {assistants.length > 0 && (
          <DndProvider backend={HTML5Backend}>
            <SpaceBetween direction="vertical" size="m">
              <hr />
              {assistants.map((assistant) => (
                <DraggableAssistant key={assistant.id} assistant={assistant} />
              ))}
            </SpaceBetween>
          </DndProvider>
        )}
      </SpaceBetween>
      <ChooseAssistantModal
        visible={assistantSelectionModalVisible}
        setVisible={setAssistantSelectionModalVisible}
      />
    </Container>
  );
};

export default AssistantsPane;
