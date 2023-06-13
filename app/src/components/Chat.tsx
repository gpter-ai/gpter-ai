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
  Textarea,
} from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { AssistantFormFields } from '@/data/types';
import { useAssistantModal } from '@/context/AssistantModal';
import DangerModal from './DangerModal';
import { ConversationView } from '@/components/ConversationView';

import './Chat.scss';
import { assertNonNullable } from '@/utils/asserts';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import { useApiService } from '@/hooks/useApiService';
import { ChatService, ChatState } from '@/data/ChatService';

const Chat: FC<object> = () => {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState('');

  const [removalModalVisible, setRemovalModalVisible] = useState(false);
  const { containerRef, update: updateTextAreaSize } = useAutoGrowTextArea();
  const [receivingInProgress, setReceivingInProgress] = useState(false);

  const storageProvider = useStorageProvider();
  const { selectedAssistant, selectDefaultAssistant } = useAssistantsProvider();

  const { apiService } = useApiService();

  assertNonNullable(selectedAssistant);

  const onChatStateChange = (state: ChatState): void => {
    setReceivingInProgress(!!state.receivingInProgress);
    setInputError(state.error?.message ?? '');
  };

  const chatService = new ChatService(
    storageProvider,
    apiService,
    selectedAssistant.id,
    onChatStateChange,
  );

  useEffect(() => {
    if (text === '') {
      updateTextAreaSize();
    }
  }, [text, updateTextAreaSize]);

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
    if (props.prompt !== selectedAssistant.prompt) {
      await chatService.submitMessage(props.prompt, 'system');
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

  const onMessageSubmit = async (): Promise<void> => {
    if (!text.trim()) {
      setInputError('Please input your text');
      return;
    }

    setText('');
    await chatService.submitMessage(`${text}`, 'user');
  };

  const onStopButtonClick = (): void => {
    chatService.abortEventsReceiving();
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
    if (receivingInProgress || event.detail.shiftKey) {
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
      <ConversationView />
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
