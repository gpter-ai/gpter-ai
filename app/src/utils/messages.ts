import { ChatCompletionRequestMessage } from 'openai';
import { ChatMessage } from '@/components/types';

export const chatMessageToRequestMessage = (
  chatMessage: ChatMessage,
): ChatCompletionRequestMessage => {
  const { role, content } = chatMessage;
  return { role, content };
};
