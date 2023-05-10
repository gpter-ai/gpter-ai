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
  onPrefillClick: () => void;
};

const AssistantsList: FC<Props> = ({
  onSelectedAssistantIdChange,
  selectedAssistantId,
  assistants,
  onPrefillClick,
}) => {
  const storageProvider = useStorageProvider();
  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    storageProvider.createAssistant(props);
  };

  const onNewAssistantClick = (): void =>
    assistantModal.openModal({
      onSubmit: onAssistantModalSubmit,
      mode: 'create',
    });

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
        {assistants.length === 0 && (
          <div className="assistantsListButtonWrapper">
            <Button iconName="add-plus" onClick={onPrefillClick} variant="link">
              Get Default Assistants
            </Button>
          </div>
        )}
        <div className="assistantsListButtonWrapper">
          <Button
            iconName="add-plus"
            onClick={onNewAssistantClick}
            variant="link"
          >
            Create New Assistant
          </Button>
        </div>
      </SpaceBetween>
    </Container>
  );
};

export default AssistantsList;
