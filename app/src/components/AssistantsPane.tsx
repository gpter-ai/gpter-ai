import { FC, useState } from 'react';
import useKeypress from 'react-use-keypress';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Container, Header, Icon } from '@cloudscape-design/components';
import ChooseAssistantModal from './ChooseAssistantModal';
import { isMacOs } from '@/utils/userAgent';

import './AssistantsPane.scss';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';

const AssistantsPane: FC<object> = () => {
  const [assistantSelectionModalVisible, setAssistantSelectionModalVisible] =
    useState<boolean>(false);

  const { assistants, selectedAssistant, selectAssistantById } =
    useAssistantsProvider();

  const selectedAssistantIndex = assistants.findIndex(
    (a) => a.id === selectedAssistant?.id,
  );

  const commandKeyPressed = (event: KeyboardEvent): boolean => {
    if (isMacOs()) {
      return event.metaKey;
    }

    return event.ctrlKey;
  };

  const selectAssistantByIndex = (index: number): void => {
    if (index < 0 || index >= assistants.length) {
      return;
    }

    selectAssistantById(assistants[index]?.id);
  };

  const selectNextAssistant = (): void => {
    if (selectedAssistantIndex === -1) {
      return;
    }

    if (selectedAssistantIndex === assistants.length - 1) {
      return;
    }

    selectAssistantById(assistants[selectedAssistantIndex + 1]?.id);
  };

  const selectPreviousAssistant = (): void => {
    if (selectedAssistantIndex === -1) {
      return;
    }

    if (selectedAssistantIndex === 0) {
      return;
    }

    selectAssistantById(assistants[selectedAssistantIndex - 1]?.id);
  };

  useKeypress(['ArrowLeft', 'ArrowRight'], (event: KeyboardEvent) => {
    if (!(commandKeyPressed(event) && event.altKey)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      selectPreviousAssistant();
    }

    if (event.key === 'ArrowRight') {
      selectNextAssistant();
    }
  });

  useKeypress(['1', '2', '3', '4', '5', '6', '7', '8', '9'], (event) => {
    if (!commandKeyPressed(event)) {
      return;
    }

    selectAssistantByIndex(parseInt(event.key, 10) - 1);
  });

  // @TODO - get proper svg for pinned
  return (
    <Container header={<Header>Assistants</Header>}>
      <SpaceBetween direction="vertical" size="m">
        <div className="assistants-pane__button-wrapper">
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
          <div key={assistant.id} className="assistants-pane__button-wrapper">
            <Button
              onClick={() => selectAssistantById(assistant.id)}
              variant={
                assistant.id === selectedAssistant?.id ? 'primary' : 'normal'
              }
            >
              <div className="assistants-pane__button-inner">
                {assistant.name}
                {assistant.pinnedTime && <Icon name="expand" />}
              </div>
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
