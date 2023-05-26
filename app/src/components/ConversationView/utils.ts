import { ChatItem, ChatItemType } from './types';
import { ChatMessage } from '@/components/types';
import { getSessionStartDate } from '@/data/sessionHelper';

export const chatMessagesToChatItems = (
  chatMessages: ChatMessage[],
): ChatItem[] => {
  const sessionStartDate = getSessionStartDate(
    chatMessages.map((x) => x.timestamp),
  );

  const sessionBreakIndex = chatMessages.findIndex(
    (msg) => msg.timestamp >= sessionStartDate,
  );

  return chatMessages.reduce((acc, message, idx) => {
    if (idx > 0 && idx === sessionBreakIndex) {
      acc.push({ type: ChatItemType.SessionBreak });
    }

    acc.push({ type: ChatItemType.Message, message });

    return acc;
  }, [] as ChatItem[]);
};
