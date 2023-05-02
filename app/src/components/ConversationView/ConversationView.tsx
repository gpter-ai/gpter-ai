import React from 'react';
import { SpaceBetween } from '@cloudscape-design/components';
import { ChatMessage } from '@/components/types';
import { chatMessagesToChatItems } from './utils';
import { ConversationViewItem } from './ConversationViewItem';
import { useAutoScrollToBottom } from '@/hooks/useAutoScrollToBottom';
import './ConversationView.scss';

interface Props {
  messages: ChatMessage[];
}

export const ConversationView: React.FC<Props> = ({ messages }) => {
  const itemsToRender = chatMessagesToChatItems(messages);
  const lastMessage = messages.findLast(() => true)?.content.length ?? '';
  const ref = useAutoScrollToBottom([messages.length, lastMessage]);

  return (
    <div ref={ref} className="conversationView">
      <SpaceBetween size="m">
        {itemsToRender.map((content, idx) => (
          <ConversationViewItem key={idx} content={content} />
        ))}
      </SpaceBetween>
    </div>
  );
};
