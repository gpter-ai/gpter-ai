import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container } from '@cloudscape-design/components';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';

type Props = {
  setSelectedAssistant: (assistant: Assistant) => void;
};

const AssistantsList = ({ setSelectedAssistant }: Props) => {
  const dataProvider = useDataProvider();
  const assistants = dataProvider.getAssistants();
  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields) => {
    // @TODO implement respective data provider method
    console.log('yay!', props);
  };

  const onNewAssistantClick = () =>
    assistantModal!.openModal({ onSubmit: onAssistantModalSubmit });

  return (
    <Container>
      <SpaceBetween direction="vertical" size="m">
        {assistants.map((assistant) => (
          <Box key={assistant.id}>
            <Button onClick={() => setSelectedAssistant(assistant)}>
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
