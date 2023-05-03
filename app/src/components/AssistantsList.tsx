import { FC } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Container } from '@cloudscape-design/components';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import './AssistantsList.scss';
import { Nullable } from '@/types';

type Props = {
  onSelectedAssistantIdChange: (id: string) => void;
  selectedAssistantId: Nullable<string>;
  assistants: Assistant[];
};

const AssistantsList: FC<Props> = ({
  onSelectedAssistantIdChange,
  selectedAssistantId,
  assistants,
}) => {
  const storageProvider = useStorageProvider();
  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    storageProvider.createAssistant(props);
  };

  const onNewAssistantClick = (): void =>
    assistantModal.openModal({ onSubmit: onAssistantModalSubmit });

  return (
    <Container>
      <SpaceBetween direction="vertical" size="m">
        {assistants.map((assistant) => (
          <div key={assistant.id} className="assistantsListButtonWrapper">
            <Button
              onClick={() => onSelectedAssistantIdChange(assistant.id)}
              variant={
                assistant.id === selectedAssistantId ? 'primary' : 'normal'
              }
            >
              {assistant.name}
            </Button>
          </div>
        ))}
        <Button iconName="add-plus" onClick={onNewAssistantClick}>
          Create New Assistant
        </Button>
      </SpaceBetween>
    </Container>
  );
};

export default AssistantsList;
