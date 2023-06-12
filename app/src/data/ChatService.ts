import Dexie from 'dexie';
import { ChatCompletionRequestMessage } from 'openai';
import { StorageProvider } from '@/data/StorageProvider';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
import { Chunk, ChunkContentKind, PartialChunkData } from './types';
import { assertNonNullable } from '@/utils/asserts';
// TODO remove import from components
import { ChatMessage } from '@/components/types';
import { getSessionStartDate } from './sessionHelper';
import { Nullable } from '@/types';
import ApiError from '@/api/error/ApiError';
import { useApiService } from '@/hooks/useApiService';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { promptServiceMessages } from './serviceMessages';
import TimeoutError from '@/api/error/TimeoutError';

export class ChatService {
  public receivingInProgress: Record<string, boolean> = {};

  constructor(
    private storageProvider: StorageProvider,
    private apiService: ApiService,
    private abortController: AbortController,
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
      timestamp: Number(assistant.creationDate) ?? 0,
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

    const lastPromptIndex = messages.findLastIndex(
      (message) => message.role === 'system',
    );

    if (lastPromptIndex !== -1) {
      return messages.slice(lastPromptIndex);
    }

    return [promptMessage, ...messages];
  }

  public async abortEventsReceiving(assistantId: string): Promise<void> {
    this.abortController.abort();
    this.abortController = new AbortController();

    Dexie.currentTransaction && Dexie.currentTransaction.abort();

    const lastChunk = await this.storageProvider.getLastChunkByAssistant(
      assistantId,
    );
    if (lastChunk && lastChunk.content.kind !== ChunkContentKind.DONE) {
      await this.storageProvider.createChunk({
        content: { kind: ChunkContentKind.DONE },
        role: 'assistant',
        assistantId,
      });
    }

    this.receivingInProgress[assistantId] = false;
  }

  public async submitMessage(
    message: string,
    assistantId: string,
    role: 'user' | 'system' = 'user',
    onError?: (error: ApiError) => void,
  ): Promise<void> {
    const messageChunk: PartialChunkData = {
      content: { message, kind: ChunkContentKind.DATA },
      role,
      assistantId,
    };

    const doneChunk: PartialChunkData = {
      content: { kind: ChunkContentKind.DONE },
      role,
      assistantId,
    };

    await this.storageProvider.createChunk(messageChunk);

    setTimeout(async () => {
      await this.storageProvider.createChunk(doneChunk);
      const sessionHistory = await this.getSessionHistory(assistantId);

      const messages =
        role === 'system'
          ? sessionHistory.concat(promptServiceMessages)
          : sessionHistory;

      await this.onMessageSubmit(assistantId, messages, onError);
    }, 50);
  }

  private async onMessageSubmit(
    assistantId: string,
    messages: ChatMessage[],
    onError?: (error: ApiError) => void,
  ): Promise<void> {
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

    const abortCallback = async (): Promise<void> => {
      await this.abortEventsReceiving(assistantId);
    };

    window.addEventListener('beforeunload', abortCallback);

    try {
      this.receivingInProgress[assistantId] = true;
      await this.apiService.sendMessages(
        messages.map(this.chatMessageToRequestMessage),
        processResponse,
        this.abortController.signal,
      );
    } catch (error) {
      if (error instanceof ApiError || error instanceof TimeoutError) {
        await this.abortEventsReceiving(assistantId);
        onError && onError(error as ApiError);
      }
    } finally {
      this.receivingInProgress[assistantId] = false;
      window.removeEventListener('beforeunload', abortCallback);
    }
  }
}

let chatService: Nullable<ChatService> = null;

export const useChatService = (): {
  chatService: ChatService;
} => {
  const storageProvider = useStorageProvider();
  const { apiService } = useApiService();

  if (chatService) {
    return { chatService };
  }

  chatService = new ChatService(
    storageProvider,
    apiService,
    new AbortController(),
  );

  return { chatService };
};
