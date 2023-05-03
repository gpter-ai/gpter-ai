import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  InputProps,
  NonCancelableCustomEvent,
  SpaceBetween,
  Spinner,
  Textarea,
} from '@cloudscape-design/components';
import React, { FC, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';
import { useChatService } from '@/data/ChatService';
import { ChatMessage } from './types';
import { ConversationView } from '@/components/ConversationView';

type Props = {
  assistant: Assistant;
};

const Chat: FC<Props> = ({ assistant }) => {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const storageProvider = useStorageProvider();
  const { chatService } = useChatService(storageProvider);

  const fetchHistory = (): Promise<ChatMessage[]> => {
    setLoadingHistory(true);
    return storageProvider
      .getChunksByAssistant(assistant.id)
      .then((chunks) => chunks.sort((a, b) => a.timestamp - b.timestamp))
      .then(chatService.convertChunksToMessages)
      .finally(() => setLoadingHistory(false));
  };

  const history: ChatMessage[] = useLiveQuery(
    fetchHistory,
    [storageProvider, assistant.id],
    [],
  );

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
  const needShowSpinner = loadingHistory && isEmptyState;
  const renderConversation = !loadingHistory && !isEmptyState;
  const textAreaRowCount = renderConversation ? 2 : 20;

  return (
    <Container
      header={
        <Header actions={headerActions} variant="h2">
          {assistant.name}
        </Header>
      }
    >
      <div ref={containerRef}>
        <SpaceBetween size="m" direction="vertical">
          {needShowSpinner && (
            <Box textAlign="center">
              <Spinner size="large" />;
            </Box>
          )}
          {renderConversation && <ConversationView messages={history} />}
          <FormField errorText={inputError} stretch label="Type a query">
            <Textarea
              value={text}
              onChange={onValueChange}
              rows={textAreaRowCount}
              autoFocus
            />
          </FormField>
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
