import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  Icon,
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
    <Button variant="link" onClick={onMessageSubmit}>
      <Box padding={{ bottom: 's' }}>
        <Icon
          svg={
            <span>
              <svg
                className="message-submit__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
              </svg>
            </span>
          }
          size="big"
        />
      </Box>
    </Button>
  );

  const StopButton = (
    <Button variant="link" onClick={onStopButtonClick}>
      <Icon
        svg={
          <span>
            <svg
              className="message-stop__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </span>
        }
        size="big"
      />
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
        <ConversationView messages={history} />
        <hr />
        <FormField errorText={inputError} stretch>
          <div className="chat__textarea-wrapper">
            <Textarea
              placeholder="Write a message"
              onKeyDown={handleChatKeyDown}
              value={text}
              onChange={onValueChange}
              rows={2}
              autoFocus
              readOnly={receivingInProgress}
            />
            <div className="chat__main-action">
              {receivingInProgress ? StopButton : SubmitButton}
            </div>
          </div>
        </FormField>
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
