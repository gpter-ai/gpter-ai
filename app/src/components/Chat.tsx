import {
  Box,
  Button,
  ButtonDropdown,
  ButtonDropdownProps,
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

    if (props.prompt !== selectedAssistant.prompt) {
      await chatService.submitPromptOnly(selectedAssistant.id, onApiError);
    }
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

  // @TODO get an svg and iconSvg instead of iconName
  const headerActionItems: ButtonDropdownProps.Item[] = [
    selectedAssistant.pinnedTime
      ? { text: 'Unpin', id: 'unpin', iconName: 'undo' }
      : { text: 'Pin', id: 'pin', iconName: 'expand' },
    { text: 'Edit', id: 'vi', iconName: 'edit' },
    { text: 'Delete', id: 'rm', iconName: 'remove' },
  ];

  const headerActions = (
    <ButtonDropdown
      items={headerActionItems}
      onItemClick={(
        event: CustomEvent<ButtonDropdownProps.ItemClickDetails>,
      ): void => {
        if (event.detail.id === 'pin') {
          storageProvider.pinAssistant(selectedAssistant.id);
        } else if (event.detail.id === 'unpin') {
          storageProvider.unpinAssistant(selectedAssistant.id);
        } else if (event.detail.id === 'vi') {
          onEditAssistantClick();
        } else if (event.detail.id === 'rm') {
          onDeleteAssistantClick();
        }
      }}
    >
      Actions
    </ButtonDropdown>
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
    <Button variant="primary" iconAlign="right" onClick={onMessageSubmit}>
      <Box fontSize="heading-s" color="inherit" variant="span">
        Send
      </Box>
    </Button>
  );

  const StopButton = (
    <Button onClick={onStopButtonClick}>
      <Box fontSize="heading-s">Stop</Box>
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
      <div className="header__line" />
      <ConversationView messages={history} />
      <Box margin={{ vertical: 'm' }}>
        <hr />
      </Box>
      <FormField errorText={inputError} stretch>
        <div className="chat__textarea-wrapper">
          <div ref={containerRef}>
            <Textarea
              onKeyDown={handleChatKeyDown}
              value={text}
              onChange={onValueChange}
              placeholder="Write a message"
              rows={2}
              autoFocus
              readOnly={receivingInProgress}
            />
          </div>
          <div className="chat__main-action">
            {receivingInProgress ? StopButton : SubmitButton}
          </div>
        </div>
      </FormField>
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
