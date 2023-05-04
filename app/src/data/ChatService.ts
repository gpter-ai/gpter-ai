import { useContext } from 'react';
import Dexie from 'dexie';
import { ChatCompletionRequestMessage } from 'openai';
import { StorageProvider } from '@/data/StorageProvider';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
import { Chunk, ChunkContentKind, PartialChunkData } from './types';
import { assertNonNullable } from '@/utils/asserts';
// TODO remove import from components
import { ChatMessage } from '@/components/types';
import { getSessionStartDate } from './sessionHelper';
import { OpenAiApiService } from '@/api/openaiApiService';
import { UserConfigContext } from '@/context/UserConfig';
import { MockApiService } from '@/api/mockApiService';

export class ChatService {
  constructor(
    private storageProvider: StorageProvider,
    private apiService: ApiService,
  ) {}

  chatMessageToRequestMessage(
    chatMessage: ChatMessage,
  ): ChatCompletionRequestMessage {
    const { role, content } = chatMessage;
    return { role, content };
  }

  convertChunksToMessages(chunks: Chunk[]): ChatMessage[] {
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
  }

  async getSessionHistory(assistantId: string): Promise<ChatMessage[]> {
    const assistant = await this.storageProvider.getAssistant(assistantId);

    assertNonNullable(assistant);

    const promptMessage: ChatMessage = {
      role: 'system',
      content: assistant.prompt,
      timestamp: Number(assistant.creation_date) ?? 0,
      finished: true,
    };

    const chunks = await this.storageProvider
      .getChunksByAssistant(assistantId)
      .then((result) => result.sort((a, b) => a.timestamp - b.timestamp));

    const timeStamps = chunks
      .filter((x) => x.role === 'user')
      .map((chunk) => chunk.timestamp);
    const sessionStartDate = getSessionStartDate(timeStamps);

    const messages = this.convertChunksToMessages(
      chunks.filter((chunk) => chunk.timestamp >= sessionStartDate),
    );

    return [promptMessage, ...messages];
  }

  public async onMessageSubmit(
    message: string,
    assistantId: string,
  ): Promise<void> {
    const userMessageChunk: PartialChunkData = {
      content: { message, kind: ChunkContentKind.DATA },
      role: 'user',
      assistantId,
    };

    const userDoneChunk: PartialChunkData = {
      content: { kind: ChunkContentKind.DONE },
      role: 'user',
      assistantId,
    };

    await this.storageProvider.createChunk(userMessageChunk);
    await this.storageProvider.createChunk(userDoneChunk);

    const messages = await this.getSessionHistory(assistantId);

    const processAbort = async (): Promise<void> => {
      Dexie.currentTransaction && Dexie.currentTransaction.abort();

      await this.storageProvider.createChunk({
        content: { kind: ChunkContentKind.DONE },
        role: 'assistant',
        assistantId,
      });
    };

    const processResponse = (response: ApiResponse): void => {
      // @TODO - consider using finish reason instead
      if (response.kind === ApiResponseType.Done) {
        this.storageProvider.createChunk({
          content: { kind: ChunkContentKind.DONE },
          role: 'assistant',
          assistantId,
        });
        return;
      }

      this.storageProvider.createChunk({
        role: 'assistant',
        assistantId,
        content: {
          kind: ChunkContentKind.DATA,
          message: response.message,
        },
      });
    };

    await this.apiService.sendMessages(
      messages.map(this.chatMessageToRequestMessage),
      processResponse,
      processAbort,
    );
  }
}

const USE_MOCK_API = false;

export const useChatService = (
  storageProvider: StorageProvider,
): {
  chatService: ChatService;
} => {
  const { userConfig } = useContext(UserConfigContext);

  const apiService = USE_MOCK_API
    ? new MockApiService()
    : new OpenAiApiService(userConfig?.apiKey ?? '');

  return { chatService: new ChatService(storageProvider, apiService) };
};
