import { FC, useEffect, useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container } from '@cloudscape-design/components';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';

type Props = {
  setSelectedAssistant: (assistant: Assistant) => void;
};

const AssistantsList: FC<Props> = ({ setSelectedAssistant }) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const dataProvider = useDataProvider();
  const assistantModal = useAssistantModal();

  useEffect(() => {
    dataProvider.getAssistants().then(setAssistants);
  }, [dataProvider]);

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    dataProvider.createAssistant(props);
  };

  const onNewAssistantClick = (): void =>
    assistantModal.openModal({ onSubmit: onAssistantModalSubmit });

  return (
    <Container>
      <SpaceBetween direction="vertical" size="m">
        {assistants.map((assistant) => (
          <Box key={assistant.id}>
            <Button onClick={(): void => setSelectedAssistant(assistant)}>
              {assistant.name}
            </Button>
          </Box>
        ))}
        <Button iconName="add-plus" onClick={onNewAssistantClick}>
          Create New Assistant
        </Button>
      </SpaceBetween>
    </Container>
  );
};

export default AssistantsList;
