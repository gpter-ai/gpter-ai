import { ChatItem, ChatItemType } from './types';
import { ChatMessage } from '@/components/types';
import { getSessionStartDate } from '@/data/sessionHelper';

export const chatMessagesToChatItems = (
  chatMessages: ChatMessage[],
): ChatItem[] => {
  const sessionStartDate = getSessionStartDate(
    chatMessages.map((x) => x.timestamp),
  );

  const sessionBreakIndex = chatMessages.findLastIndex(
    (msg) => msg.timestamp < sessionStartDate,
  );

  return chatMessages.reduce((acc, message, idx) => {
    acc.push({ type: ChatItemType.Message, message });

    if (idx === sessionBreakIndex) {
      acc.push({ type: ChatItemType.SessionBreak });
    }

    return acc;
  }, [] as ChatItem[]);
};
