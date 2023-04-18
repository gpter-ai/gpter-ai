import { useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Box, Container } from '@cloudscape-design/components';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant, AssistantCreation } from '@/data/types';
import CreateAssistantModal from './CreateAssistantModal';

type Props = {
  setSelectedAssistant: (assistant: Assistant) => void;
};

const AssistantsList = ({ setSelectedAssistant }: Props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const dataProvider = useDataProvider();
  const assistants = dataProvider.getAssistants();

  const onCreateAssistant = ({ name, prompt }: AssistantCreation) => {
    // @TODO implement respective data provider method
    console.log('yay!', name, prompt);
  };

  return (
    <>
      <Container>
        <SpaceBetween direction="vertical" size="m">
          {assistants.map((assistant) => (
            <Box key={assistant.id}>
              <Button onClick={() => setSelectedAssistant(assistant)}>
                {assistant.name}
              </Button>
            </Box>
          ))}
          <Button iconName="add-plus" onClick={() => setModalVisible(true)}>
            Create New Assistant
          </Button>
        </SpaceBetween>
      </Container>
      <CreateAssistantModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onCreate={onCreateAssistant}
      />
    </>
  );
};

export default AssistantsList;
