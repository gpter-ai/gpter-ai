import {
  Box,
  Button,
  Container,
  Header,
  InputProps,
  NonCancelableCustomEvent,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';

type Props = {
  assistant: Assistant;
};

const Chat = ({ assistant }: Props) => {
  const [text, setText] = useState('');
  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const dataProvider = useDataProvider();
  const queries = dataProvider.getQueriesByAssistant(assistant.id);

  const historyText = queries
    .map(
      (query) => `Question: ${query.content} ~~~ Response: ${query.response}`,
    )
    .join('\n');

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ) => {
    setText(e.detail.value);
    updateTextAreaHeight();
  };

  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields) => {
    // @TODO implement respective data provider method
    console.log('EDITED!', props);
  };

  const onEditAssistantClick = () =>
    assistantModal!.openModal({
      onSubmit: onAssistantModalSubmit,
      initData: { name: assistant.name, prompt: assistant.prompt },
    });

  const onDeleteAssistantClick = () => {
    setRemovalModalVisible(true);
  };

  const removeAssistant = () => {
    console.log(`Removing ${assistant.name}`);
    setRemovalModalVisible(false);
  };

  const headerActions = (
    <SpaceBetween direction="horizontal" size="xs">
      <Button iconName="edit" onClick={onEditAssistantClick}>
        Edit
      </Button>
      <Button iconName="remove" onClick={onDeleteAssistantClick}>
        Delete
      </Button>
    </SpaceBetween>
  );

  return (
    <Container
      header={
        <Header
          actions={headerActions}
          variant="h2"
          description="Please input your text"
        >
          {assistant.name}
        </Header>
      }
    >
      <div ref={containerRef}>
        <SpaceBetween size="m" direction="vertical">
          <Textarea value={historyText} rows={10} disabled />
          <Textarea value={text} onChange={onValueChange} rows={1} autoFocus />
          <Box textAlign="right">
            <Button variant="primary">Submit</Button>
          </Box>
        </SpaceBetween>
      </div>
      <DangerModal
        visible={removalModalVisible}
        text={`You are about to remove ${assistant.name}. Are you sure?`}
        header={`Removing ${assistant.name}`}
        onCancel={() => setRemovalModalVisible(false)}
        onConfirm={removeAssistant}
      />
    </Container>
  );
};

export default Chat;
