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
import { useEffect, useState } from 'react';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';

type Props = {
  assistant: Assistant;
  chooseSelectedAssistant: () => void;
};

const Chat = ({ assistant, chooseSelectedAssistant }: Props) => {
  const [text, setText] = useState('');

  // @TODO - replace with an array of message objects later
  const [historyText, setHistoryText] = useState<string>('');

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getMessagesByAssistant(assistant.id!)
      .then((msgs) =>
        setHistoryText(
          msgs.map((message) => `${message.chunks.join('')}`).join('\n'),
        ),
      );
  }, []);

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ) => {
    setText(e.detail.value);
    updateTextAreaHeight();
  };

  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields) => {
    dataProvider.updateAssistant(assistant.id!, props);
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
    dataProvider.deleteAssistant(assistant.id!);
    setRemovalModalVisible(false);
    chooseSelectedAssistant();
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
