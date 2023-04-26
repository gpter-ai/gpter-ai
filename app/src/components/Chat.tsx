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
import { ChatCompletionRequestMessage } from 'openai';
import { FC, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';
import { useChatService } from '@/data/ChatService';

type Props = {
  assistant: Assistant;
  chooseSelectedAssistant: () => void;
};

const Chat: FC<Props> = ({ assistant, chooseSelectedAssistant }) => {
  const [text, setText] = useState('');

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const storageProvider = useStorageProvider();
  const { chatService } = useChatService(storageProvider);

  const fetchHistory = (): Promise<ChatCompletionRequestMessage[]> => {
    return storageProvider
      .getChunksByAssistant(assistant.id)
      .then((chunks) => chunks.sort((a, b) => a.timestamp - b.timestamp))
      .then(chatService.convertChunksToMessages);
  };

  const history: ChatCompletionRequestMessage[] = useLiveQuery(
    fetchHistory,
    [storageProvider, assistant.id],
    [],
  );

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ): void => {
    setText(e.detail.value);
    updateTextAreaHeight();
  };

  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    storageProvider.updateAssistant(assistant.id, props);
  };

  const onEditAssistantClick = (): void =>
    assistantModal.openModal({
      onSubmit: onAssistantModalSubmit,
      initData: {
        name: assistant.name,
        prompt: assistant.prompt,
      },
    });

  const onDeleteAssistantClick = (): void => {
    setRemovalModalVisible(true);
  };

  const removeAssistant = async (): Promise<void> => {
    await storageProvider.deleteAssistant(assistant.id);
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

  const onMessageSubmit = async (): Promise<void> => {
    setText('');
    await chatService.onMessageSubmit(`${text}`, assistant.id);
  };

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
          <Textarea
            value={history.map((m) => `${m.role}: ${m.content}`).join('\n\n')}
            rows={10}
            disabled
          />
          <Textarea value={text} onChange={onValueChange} rows={1} autoFocus />
          <Box textAlign="right">
            <Button variant="primary" onClick={onMessageSubmit}>
              Submit
            </Button>
          </Box>
        </SpaceBetween>
      </div>
      <DangerModal
        visible={removalModalVisible}
        text={`You are about to remove ${assistant.name}. Are you sure?`}
        header={`Removing ${assistant.name}`}
        onCancel={(): void => setRemovalModalVisible(false)}
        onConfirm={removeAssistant}
      />
    </Container>
  );
};

export default Chat;
