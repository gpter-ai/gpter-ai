import { ChatCompletionRequestMessage } from 'openai';
import { StorageProvider } from '@/data/StorageProvider';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
import { MockApiService } from '@/api/mockApiService';
import { Chunk } from './types';
import { assertNonNullable } from '@/utils/asserts';

export class ChatService {
  #apiService: ApiService;

  constructor(private storageProvider: StorageProvider) {
    this.#apiService = new MockApiService();
  }

  convertChunksToMessages(chunks: Chunk[]): ChatCompletionRequestMessage[] {
    if (chunks.length === 0) return [];
    const messages: ChatCompletionRequestMessage[] = [];

    let currentMessage: ChatCompletionRequestMessage =
      {} as ChatCompletionRequestMessage;

    for (const chunk of chunks) {
      // @TODO - here we trust that a chunk with a role is always the first chunk of a message
      if (chunk.role && chunk.role !== currentMessage.role) {
        if (currentMessage.role && currentMessage.content) {
          messages.push(currentMessage);
        }
        currentMessage = { role: chunk.role, content: chunk.content ?? '' };
      } else {
        currentMessage.content += chunk.content ?? '';
      }
    }

    messages.push(currentMessage);

    return messages;
  }

  async completeMessageHistory(
    assistantId: string,
  ): Promise<ChatCompletionRequestMessage[]> {
    const assistant = await this.storageProvider.getAssistant(assistantId);

    assertNonNullable(assistant);

    const promptMessage: ChatCompletionRequestMessage = {
      role: 'system',
      content: assistant.prompt,
    };

    // @TODO - implement more sophisticated logic (exponential reduce)
    const timestampDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const messages = await this.storageProvider
      .getChunksByFilter(
        (chunk) =>
          chunk.assistantId === assistantId &&
          chunk.timestamp > timestampDayAgo,
      )
      .then((chunks) => chunks.sort((a, b) => a.timestamp - b.timestamp))
      .then(this.convertChunksToMessages);

    return [promptMessage, ...messages];
  }

  public async onMessageSubmit(
    message: string,
    assistantId: string,
  ): Promise<void> {
    const chunkData: Omit<Chunk, 'id'> = {
      content: message,
      role: 'user',
      assistantId,
      timestamp: Date.now(),
    };

    await this.storageProvider.createChunk(chunkData);

    const messages = await this.completeMessageHistory(assistantId);

    const processResponse = (response: ApiResponse): void => {
      // @TODO temp logic
      if (response.kind === ApiResponseType.Data) {
        const chunkContent = response.data?.choices[0]?.message?.content ?? '';

        this.storageProvider.createChunk({
          content: chunkContent,
          role: 'assistant',
          assistantId,
          timestamp: Date.now(),
        });
      }
    };

    await this.#apiService.sendMessages(messages, processResponse);
  }
}

export const useChatService = (
  storageProvider: StorageProvider,
): {
  chatService: ChatService;
} => {
  return { chatService: new ChatService(storageProvider) };
};
