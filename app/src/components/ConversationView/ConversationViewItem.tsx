import React from 'react';
import { ChatItem, ChatItemType } from './types';
import { MessageItem } from './MessageItem';
import { SessionBreakItem } from '@/components/ConversationView/SessionBreakItem';

interface Props {
  content: ChatItem;
}

export const ConversationViewItem: React.FC<Props> = ({ content }) => {
  switch (content.type) {
    case ChatItemType.Message:
      return <MessageItem message={content.message} />;
    case ChatItemType.SessionBreak:
      return <SessionBreakItem />;
  }

  throw new Error(`Unknown chat item type: ${JSON.stringify(content)}`);
};
