import React, { memo } from 'react';
import { ChatItem, ChatItemType } from './types';
import { MessageItem } from './MessageItem';
import { SessionBreakItem } from '@/components/ConversationView/SessionBreakItem';

interface Props {
  content: ChatItem;
}

const propsAreEqual = (
  { content: prevContent }: Props,
  { content: nextContent }: Props,
): boolean => {
  if (prevContent.type !== nextContent.type) {
    return false;
  }

  if (
    prevContent.type === ChatItemType.Message &&
    nextContent.type === ChatItemType.Message
  ) {
    return prevContent.message.content === nextContent.message.content;
  }

  return true;
};

export const ConversationViewItem: React.FC<Props> = memo(({ content }) => {
  switch (content.type) {
    case ChatItemType.Message:
      return <MessageItem message={content.message} />;
    case ChatItemType.SessionBreak:
      return <SessionBreakItem />;
  }

  throw new Error(`Unknown chat item type: ${JSON.stringify(content)}`);
}, propsAreEqual);
