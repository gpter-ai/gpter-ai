import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  InputProps,
  NonCancelableCustomEvent,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';
import { useChatService } from '@/data/ChatService';
import { ChatMessage } from './types';
import { ConversationView } from '@/components/ConversationView';

import './Chat.scss';

type Props = {
  assistant: Assistant;
};

const Chat: FC<Props> = ({ assistant }) => {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState('');
  const [receivingInProgress, setReceivingInProgress] = useState(false);

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const storageProvider = useStorageProvider();
  const { chatService } = useChatService(storageProvider);

  const fetchHistory = (): Promise<ChatMessage[]> => {
    return storageProvider
      .getChunksByAssistant(assistant.id)
      .then(chatService.convertChunksToMessages);
  };

  const history: ChatMessage[] = useLiveQuery(
    fetchHistory,
    [storageProvider, assistant.id],
    [],
  );

  useEffect(() => {
    const lastMessage = history.at(-1);

    setReceivingInProgress(
      !!(
        lastMessage &&
        lastMessage.role === 'assistant' &&
        !lastMessage.finished
      ),
    );
  }, [history, assistant.id]);

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ): void => {
    setInputError('');
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
    if (!text.trim()) {
      setInputError('Please input your text');
      return;
    }

    setText('');
    await chatService.onMessageSubmit(`${text}`, assistant.id);
  };

  const isEmptyState = history.length === 0;
  const renderConversation = !isEmptyState;
  const textAreaRowCount = renderConversation ? 2 : 20;

  const onStopButtonClick = (): void => {
    chatService.abortEventsReceiving(assistant.id);
  };

  const SubmitButton = (
    <Button variant="primary" onClick={onMessageSubmit}>
      Submit
    </Button>
  );

  const StopButton = (
    <Button iconName="status-negative" onClick={onStopButtonClick}>
      Stop
    </Button>
  );

  return (
    <Container
      header={
        <Header actions={headerActions} variant="h2">
          {assistant.name}
        </Header>
      }
    >
      <div ref={containerRef}>
        <div className="header__line" />
        <SpaceBetween size="m" direction="vertical">
          {renderConversation && <ConversationView messages={history} />}
          <FormField errorText={inputError} stretch label="Type a query">
            <Textarea
              value={text}
              onChange={onValueChange}
              rows={textAreaRowCount}
              autoFocus
              disabled={receivingInProgress}
            />
          </FormField>
          <Box textAlign="right">
            {receivingInProgress ? StopButton : SubmitButton}
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
