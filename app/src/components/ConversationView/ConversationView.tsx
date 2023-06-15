import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SpaceBetween } from '@cloudscape-design/components';
import './ConversationView.scss';
import { ConversationHistory } from '../ConversationHistory';
import { ActiveMessage } from '../ActiveMessage';
import { ChatItem, ChatItemType, MessageChatItem } from './types';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { chatMessagesToChatItems } from './utils';
import { convertChunksToMessages } from '@/utils/chunks';
import { ChatService, ChatState } from '@/data/ChatService';
import { useApiService } from '@/hooks/useApiService';
import { assertNonNullable } from '@/utils/asserts';

export const ConversationView: React.FC<object> = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const storageProvider = useStorageProvider();
  const { selectedAssistant } = useAssistantsProvider();
  const { apiService } = useApiService();

  assertNonNullable(selectedAssistant);

  const chatService = useMemo(
    () =>
      ChatService.getInstance(
        storageProvider,
        apiService,
        selectedAssistant.id,
      ),
    [storageProvider, apiService, selectedAssistant.id],
  );

  const [history, setHistory] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (!selectedAssistant) {
      return;
    }

    storageProvider
      .getChunksByAssistant(selectedAssistant.id)
      .then(convertChunksToMessages)
      .then((msgs) => {
        if (msgs.length > 0) {
          setHistory(chatMessagesToChatItems(msgs));
        } else {
          chatService.submitMessage(selectedAssistant.prompt, 'system');
        }
      });
  }, [selectedAssistant, storageProvider, chatService]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const lastMessage = useMemo(
    () => history[history.length - 1],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history.length],
  );

  const chatStateListener = useCallback(
    (state: ChatState) => {
      if (!state.lastMessage || lastMessage?.type !== ChatItemType.Message) {
        return;
      }

      if (
        !lastMessage ||
        state.lastMessage.content !== lastMessage.message.content ||
        state.lastMessage.role !== lastMessage.message.role
      ) {
        const newHistory = [
          ...history,
          {
            type: ChatItemType.Message,
            message: state.lastMessage as MessageChatItem['message'],
          },
        ];

        setHistory(newHistory);
      }
    },
    [history, lastMessage],
  );

  useEffect(() => {
    chatService.registerStateListener(chatStateListener);

    return () => {
      chatService.unregisterStateListener(chatStateListener);
    };
  }, [chatService, chatStateListener]);

  return (
    <div ref={ref} className="conversationView">
      <SpaceBetween size="m">
        <ConversationHistory history={history} />
        {selectedAssistant && (
          <ActiveMessage
            chatService={chatService}
            scrollToBottom={scrollToBottom}
          />
        )}
      </SpaceBetween>
    </div>
  );
};
