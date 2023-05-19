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
import { FC, useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { useKeysProvider } from '@/hooks/useKeysProvider';
import { AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';
import { useChatService } from '@/data/ChatService';
import { ChatMessage } from './types';
import { ConversationView } from '@/components/ConversationView';

import './Chat.scss';
import ApiError from '@/api/error/ApiError';
import { assertNonNullable } from '@/utils/asserts';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';

const Chat: FC<object> = () => {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState('');
  const [receivingInProgress, setReceivingInProgress] = useState(false);

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef } = useAutoGrowTextArea();

  const storageProvider = useStorageProvider();
  const { chatService } = useChatService(storageProvider);
  const { shiftPressed } = useKeysProvider();

  const { selectedAssistant, selectDefaultAssistant } = useAssistantsProvider();

  assertNonNullable(selectedAssistant);

  const fetchHistory = (): Promise<ChatMessage[]> => {
    return storageProvider
      .getChunksByAssistant(selectedAssistant.id)
      .then(chatService.convertChunksToMessages);
  };

  const history: ChatMessage[] = useLiveQuery(
    fetchHistory,
    [storageProvider, selectedAssistant.id],
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
  }, [history, selectedAssistant.id]);

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ): void => {
    setInputError('');
    setText(e.detail.value);
  };

  const assistantModal = useAssistantModal();

  const onAssistantModalSubmit = async (
    props: AssistantFormFields,
  ): Promise<void> => {
    const lastPromptUpdate =
      props.prompt === selectedAssistant.prompt
        ? selectedAssistant.lastPromptUpdate
        : new Date();

    storageProvider.updateAssistant(selectedAssistant.id, {
      ...props,
      lastPromptUpdate,
    });

    await chatService.submitPromptOnly(selectedAssistant.id, onApiError);
  };

  const onEditAssistantClick = (): void =>
    assistantModal.openModal({
      onSubmit: onAssistantModalSubmit,
      initData: {
        name: selectedAssistant.name,
        prompt: selectedAssistant.prompt,
      },
      mode: 'edit',
    });

  const onDeleteAssistantClick = (): void => {
    setRemovalModalVisible(true);
  };

  const removeAssistant = async (): Promise<void> => {
    await storageProvider.deleteAssistant(selectedAssistant.id);
    selectDefaultAssistant(selectedAssistant.id);
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

  const onApiError = useCallback((error: ApiError): void => {
    setInputError(error.message);
  }, []);

  const onMessageSubmit = async (): Promise<void> => {
    if (!text.trim()) {
      setInputError('Please input your text');
      return;
    }

    setText('');
    await chatService.submitUserMessage(
      `${text}`,
      selectedAssistant.id,
      onApiError,
    );
  };

  const onStopButtonClick = (): void => {
    chatService.abortEventsReceiving(selectedAssistant.id);
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

  const handleChatKeyDown = (
    event: CustomEvent<InputProps.KeyDetail>,
  ): void => {
    if (receivingInProgress || shiftPressed) {
      return;
    }

    if (event.detail.key === 'Enter') {
      event.preventDefault();
      onMessageSubmit();
    }
  };

  return (
    <Container
      header={
        <Header actions={headerActions} variant="h2">
          {selectedAssistant.name}
        </Header>
      }
    >
      <div ref={containerRef}>
        <div className="header__line" />
        <SpaceBetween size="m" direction="vertical">
          <ConversationView messages={history} />
          <FormField errorText={inputError} stretch label="Type a query">
            <Textarea
              onKeyDown={handleChatKeyDown}
              value={text}
              onChange={onValueChange}
              rows={2}
              autoFocus
              readOnly={receivingInProgress}
            />
          </FormField>
          <Box textAlign="right">
            {receivingInProgress ? StopButton : SubmitButton}
          </Box>
        </SpaceBetween>
      </div>
      <DangerModal
        visible={removalModalVisible}
        text={`You are about to remove ${selectedAssistant.name}. Are you sure?`}
        header={`Removing ${selectedAssistant.name}`}
        onCancel={(): void => setRemovalModalVisible(false)}
        onConfirm={removeAssistant}
      />
    </Container>
  );
};

export default Chat;
