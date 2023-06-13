import React, { useEffect, useRef, useState } from 'react';
import { SpaceBetween } from '@cloudscape-design/components';
import './ConversationView.scss';
import { ConversationHistory } from '../ConversationHistory';
import { ActiveMessage } from '../ActiveMessage';
import { ChatItem } from './types';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { chatMessagesToChatItems } from './utils';
import { convertChunksToMessages } from '@/utils/chunks';

export const ConversationView: React.FC<object> = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const storageProvider = useStorageProvider();

  const { selectedAssistant } = useAssistantsProvider();

  const [history, setHistory] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (!selectedAssistant) {
      return;
    }

    storageProvider
      .getChunksByAssistant(selectedAssistant.id)
      .then(convertChunksToMessages)
      .then((msgs) => setHistory(chatMessagesToChatItems(msgs)));
  }, [selectedAssistant, storageProvider]);

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
