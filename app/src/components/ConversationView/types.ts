import { ChatMessage } from '@/components/types';

export enum ChatItemType {
  Message = 'Message',
  SessionBreak = 'SessionBreak',
}

export interface MessageChatItem {
  type: ChatItemType.Message;
  message: ChatMessage;
}

export interface SessionSeparatorChatItem {
  type: ChatItemType.SessionBreak;
}

export type ChatItem = MessageChatItem | SessionSeparatorChatItem;
