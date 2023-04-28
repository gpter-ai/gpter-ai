import { useContext } from 'react';
import { ChatCompletionRequestMessage } from 'openai';
import { StorageProvider } from '@/data/StorageProvider';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
// import { MockApiService } from '@/api/mockApiService';
import { Chunk } from './types';
import { assertNonNullable } from '@/utils/asserts';
import { ChatMessage } from '@/components/types';
import { getHistoryStartDateFromDiffs } from './historyHelper';
import { OpenAiApiService } from '@/api/openaiApiService';
import { UserConfigContext } from '@/context/UserConfig';

export class ChatService {
  constructor(
    private storageProvider: StorageProvider,
    private apiService: ApiService,
  ) {
    // this.#apiService = new MockApiService();
  }

  chatMessageToRequestMessage(
    chatMessage: ChatMessage,
  ): ChatCompletionRequestMessage {
    const { role, content } = chatMessage;
    return { role, content };
  }

  convertChunksToMessages(chunks: Chunk[]): ChatMessage[] {
    if (chunks.length === 0) return [];
    const messages: ChatMessage[] = [];

    let currentMessage: ChatMessage = {} as ChatMessage;

    for (const chunk of chunks) {
      // @TODO - here we trust that a chunk with a role is always the first chunk of a message
      if (chunk.role && chunk.role !== currentMessage.role) {
        if (currentMessage.role && currentMessage.content) {
          messages.push(currentMessage);
        }
        currentMessage = {
          role: chunk.role,
          content: chunk.content ?? '',
          timestamp: chunk.timestamp,
        };
      } else {
        currentMessage.content += chunk.content ?? '';
      }
    }

    messages.push(currentMessage);

    return messages;
  }

  async getSessionHistory(assistantId: string): Promise<ChatMessage[]> {
    const assistant = await this.storageProvider.getAssistant(assistantId);

    assertNonNullable(assistant);

    const promptMessage: ChatMessage = {
      role: 'system',
      content: assistant.prompt,
      timestamp: Number(assistant.creation_date) ?? 0,
    };

    const chunks = await this.storageProvider
      .getChunksByAssistant(assistantId)
      .then((result) => result.sort((a, b) => a.timestamp - b.timestamp));

    const diffs = chunks.map((chunk) => Date.now() - chunk.timestamp);

    const sessionStartDate = getHistoryStartDateFromDiffs(diffs);

    const messages = this.convertChunksToMessages(
      chunks.filter((chunk) => chunk.timestamp >= sessionStartDate),
    );

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

    const messages = await this.getSessionHistory(assistantId);

    const processResponse = (response: ApiResponse): void => {
      // @TODO temp logic
      if (response.kind === ApiResponseType.Data) {
        // @TODO - it has to be delta, not messages. something's wrong with the typing
        // @ts-ignore-line
        const chunkContent = response.data?.choices[0]?.delta?.content ?? '';

        this.storageProvider.createChunk({
          content: chunkContent,
          role: 'assistant',
          assistantId,
          // @TODO - timestamp should not be in ms
          // also concerns other places in the code
          timestamp: Date.now(),
        });
      }
    };

    await this.apiService.sendMessages(
      messages.map(this.chatMessageToRequestMessage),
      processResponse,
    );
  }
}

export const useChatService = (
  storageProvider: StorageProvider,
): {
  chatService: ChatService;
} => {
  const { userConfig } = useContext(UserConfigContext);

  const apiService = new OpenAiApiService(userConfig?.apiKey ?? '');

  return { chatService: new ChatService(storageProvider, apiService) };
};
