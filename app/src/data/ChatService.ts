import Dexie from 'dexie';
import ApiError from '@/api/error/ApiError';
import TimeoutError from '@/api/error/TimeoutError';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
import { ChatMessage } from '@/components/types';
import { StorageProvider } from '@/data';
import { promptServiceMessages } from '@/data/serviceMessages';
import { getSessionStartDate } from '@/data/sessionHelper';
import { ChunkContentKind, PartialChunkData } from '@/data/types';
import { assertNonNullable } from '@/utils/asserts';
import { convertChunksToMessages } from '@/utils/chunks';
import { chatMessageToRequestMessage } from '@/utils/messages';

export type ChatState = {
  receivingInProgress: boolean;
  error?: ApiError;
};

export class ChatService {
  abortController: AbortController;

  constructor(
    private storageProvider: StorageProvider,
    private apiService: ApiService,
    private assistantId: string,
    private onStateChange?: (state: ChatState) => void,
  ) {
    this.abortController = new AbortController();
  }

  async getSessionHistory(): Promise<ChatMessage[]> {
    const assistant = await this.storageProvider.getAssistant(this.assistantId);

    assertNonNullable(assistant);

    const promptMessage: ChatMessage = {
      role: 'system',
      content: assistant.prompt,
      timestamp: Number(assistant.creationDate) ?? 0,
      finished: true,
    };

    const chunks = await this.storageProvider
      .getChunksByAssistant(this.assistantId)
      .then((result) => result.sort((a, b) => a.timestamp - b.timestamp));

    const timeStamps = chunks
      .filter((x) => x.role === 'user')
      .map((chunk) => chunk.timestamp);

    const sessionStartDate = getSessionStartDate(timeStamps);

    const messages = convertChunksToMessages(
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

  public async abortEventsReceiving(): Promise<void> {
    this.abortController.abort();
    this.abortController = new AbortController();

    Dexie.currentTransaction && Dexie.currentTransaction.abort();

    const lastChunk = await this.storageProvider.getLastChunkByAssistant(
      this.assistantId,
    );
    if (lastChunk && lastChunk.content.kind !== ChunkContentKind.DONE) {
      await this.storageProvider.createChunk({
        content: { kind: ChunkContentKind.DONE },
        role: 'assistant',
        assistantId: this.assistantId,
      });
    }

    this.onStateChange && this.onStateChange({ receivingInProgress: false });
  }

  public async submitMessage(
    message: string,
    role: 'user' | 'system' = 'user',
  ): Promise<void> {
    const messageChunk: PartialChunkData = {
      content: { message, kind: ChunkContentKind.DATA },
      role,
      assistantId: this.assistantId,
    };

    const doneChunk: PartialChunkData = {
      content: { kind: ChunkContentKind.DONE },
      role,
      assistantId: this.assistantId,
    };

    await this.storageProvider.createChunk(messageChunk);

    setTimeout(async () => {
      await this.storageProvider.createChunk(doneChunk);
      const sessionHistory = await this.getSessionHistory();

      const messages =
        role === 'system'
          ? sessionHistory.concat(promptServiceMessages)
          : sessionHistory;

      await this.onMessageSubmit(messages);
    }, 50);
  }

  private async onMessageSubmit(messages: ChatMessage[]): Promise<void> {
    const processResponse = (response: ApiResponse): void => {
      // @TODO - consider using finish reason instead
      if (response.kind === ApiResponseType.Done) {
        this.storageProvider.createChunk({
          content: { kind: ChunkContentKind.DONE },
          role: 'assistant',
          assistantId: this.assistantId,
        });
        return;
      }

      this.storageProvider.createChunk({
        role: 'assistant',
        assistantId: this.assistantId,
        content: {
          kind: ChunkContentKind.DATA,
          message: response.message,
        },
      });
    };

    const abortCallback = async (): Promise<void> => {
      await this.abortEventsReceiving();
    };

    window.addEventListener('beforeunload', abortCallback);

    try {
      this.onStateChange && this.onStateChange({ receivingInProgress: true });
      await this.apiService.sendMessages(
        messages.map(chatMessageToRequestMessage),
        processResponse,
        this.abortController.signal,
      );
    } catch (error) {
      if (error instanceof ApiError || error instanceof TimeoutError) {
        await this.abortEventsReceiving();
        this.onStateChange &&
          this.onStateChange({ error, receivingInProgress: false });
      }
    } finally {
      this.onStateChange && this.onStateChange({ receivingInProgress: false });
      window.removeEventListener('beforeunload', abortCallback);
    }
  }
}
