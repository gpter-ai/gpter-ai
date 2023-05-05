import React from 'react';
import { Box, SpaceBetween } from '@cloudscape-design/components';
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
  const lastMessageLength = messages.at(-1)?.content?.length ?? 0;
  const ref = useAutoScrollToBottom([messages.length, lastMessageLength]);

  return (
    <div ref={ref} className="conversationView">
      <SpaceBetween size="m">
        {itemsToRender.length === 0 && (
          <Box color="text-status-inactive" textAlign="center">
            No messages yet
          </Box>
        )}
        {itemsToRender.map((content, idx) => (
          <ConversationViewItem key={idx} content={content} />
        ))}
      </SpaceBetween>
    </div>
  );
};
