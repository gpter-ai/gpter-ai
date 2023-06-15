import { FC, useEffect, useState } from 'react';
import { ChatItemType, MessageChatItem } from './ConversationView/types';
import { ConversationViewItem } from './ConversationView/ConversationViewItem';
import { Nullable } from '@/types';
import { ChatService } from '@/data/ChatService';

type Props = {
  chatService: ChatService;
  scrollToBottom: () => void;
};

export const ActiveMessage: FC<Props> = ({ chatService, scrollToBottom }) => {
  const [activeMessage, setActiveMessage] =
    useState<Nullable<MessageChatItem>>(null);

  useEffect(() => {
    chatService.registerStateListener((state) => {
      setActiveMessage(
        !state.activeMessage
          ? null
          : {
              type: ChatItemType.Message,
              message: state.activeMessage,
            },
      );

      scrollToBottom();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatService, scrollToBottom]);

  if (!activeMessage) {
    return null;
  }

  return <ConversationViewItem content={activeMessage} />;
};
