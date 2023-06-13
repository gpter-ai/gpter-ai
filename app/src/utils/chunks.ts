import { ChatMessage } from '@/components/types';
import { Chunk, ChunkContentKind } from '@/data/types';

export const convertChunksToMessages = (chunks: Chunk[]): ChatMessage[] => {
  if (chunks.length === 0) return [];
  chunks.sort((a, b) => a.timestamp - b.timestamp);
  const messages: ChatMessage[] = [];

  let currentMessage = {
    content: '',
    finished: false,
  } as ChatMessage;

  for (const chunk of chunks) {
    if (chunk.content.kind === ChunkContentKind.DATA) {
      currentMessage.content += chunk.content.message;
      currentMessage.timestamp = chunk.timestamp;
      currentMessage.role = chunk.role;
    } else {
      currentMessage.finished = true;
      messages.push(currentMessage);
      currentMessage = {
        content: '',
        finished: false,
      } as ChatMessage;
    }
  }

  if (currentMessage.content.length > 0) {
    messages.push(currentMessage);
  }

  return messages;
};
