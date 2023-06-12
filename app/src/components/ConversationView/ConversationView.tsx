import React, { useEffect, useRef, useState } from 'react';
import { SpaceBetween } from '@cloudscape-design/components';
import './ConversationView.scss';
import { ConversationHistory } from '../ConversationHistory';
import { ActiveMessage } from '../ActiveMessage';
import { ChatItem } from './types';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import { useChatService } from '@/data/ChatService';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { chatMessagesToChatItems } from './utils';

export const ConversationView: React.FC<object> = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const storageProvider = useStorageProvider();
  const { chatService } = useChatService();

  const { selectedAssistant } = useAssistantsProvider();

  const [history, setHistory] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (!selectedAssistant) {
      return;
    }

    storageProvider
      .getChunksByAssistant(selectedAssistant.id)
      .then(chatService.convertChunksToMessages)
      .then((msgs) => setHistory(chatMessagesToChatItems(msgs)));
  }, [chatService.convertChunksToMessages, selectedAssistant, storageProvider]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div ref={ref} className="conversationView">
      <SpaceBetween size="m">
        <ConversationHistory history={history} />
        {selectedAssistant && (
          <ActiveMessage
            selectedAssistant={selectedAssistant}
            setHistory={setHistory}
            scrollToBottom={scrollToBottom}
          />
        )}
      </SpaceBetween>
    </div>
  );
};
