import { useLiveQuery } from 'dexie-react-hooks';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import {
  ChatItem,
  ChatItemType,
  MessageChatItem,
} from './ConversationView/types';
import { ConversationViewItem } from './ConversationView/ConversationViewItem';
import { Assistant, ChunkContentKind } from '@/data/types';
import { Nullable } from '@/types';

type Props = {
  selectedAssistant: Assistant;
  setHistory: Dispatch<SetStateAction<ChatItem[]>>;
  scrollToBottom: () => void;
};

export const ActiveMessage: FC<Props> = ({
  selectedAssistant,
  setHistory,
  scrollToBottom,
}) => {
  const storageProvider = useStorageProvider();

  const [activeMessage, setActiveMessage] =
    useState<Nullable<MessageChatItem>>(null);

  const lastChunk = useLiveQuery(
    () => storageProvider.getLastChunk(selectedAssistant.id),
    [selectedAssistant.id],
  );

  useEffect(() => {
    if (!lastChunk?.content || lastChunk?.role === 'system') {
      return;
    }

    if (lastChunk.content.kind !== ChunkContentKind.DATA) {
      if (!activeMessage) {
        return;
      }

      setHistory((history) => {
        const newHistory = [...history];
        newHistory.push({
          ...activeMessage,
          message: { ...activeMessage.message, finished: true },
        });

        setActiveMessage(null);

        return newHistory;
      });

      scrollToBottom();

      return;
    }

    if (!activeMessage) {
      setActiveMessage({
        type: ChatItemType.Message,
        message: {
          content: lastChunk.content.message,
          finished: false,
          timestamp: lastChunk.timestamp,
          role: lastChunk.role,
        },
      });

      return;
    }

    setActiveMessage({
      type: ChatItemType.Message,
      message: {
        ...activeMessage.message,
        content: activeMessage.message.content + lastChunk.content.message,
      },
    });

    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastChunk, setHistory]);

  if (!activeMessage) {
    return null;
  }

  return <ConversationViewItem content={activeMessage} />;
};
