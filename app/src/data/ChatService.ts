import Dexie from 'dexie';
import hash from 'object-hash';
import ApiError from '@/api/error/ApiError';
import TimeoutError from '@/api/error/TimeoutError';
import { ApiResponse, ApiResponseType, ApiService } from '@/api/types';
import { ChatMessage } from '@/components/types';
import { StorageProvider } from '@/data';
import { promptServiceMessages } from '@/data/serviceMessages';
import { getSessionStartDate } from '@/data/sessionHelper';
import {
  ChunkContentData,
  ChunkContentKind,
  PartialChunkData,
} from '@/data/types';
import { assertNonNullable } from '@/utils/asserts';
import { convertChunksToMessages } from '@/utils/chunks';
import { chatMessageToRequestMessage } from '@/utils/messages';
import { functionMap } from '@/api/functions';
import GeneralError from '@/api/error/GeneralError';

export type ChatState = {
  receivingInProgress?: boolean;
  error?: ApiError;
  activeMessage?: ChatMessage;
  lastMessage?: ChatMessage;
};

type ChatStateListener = (state: ChatState) => void;

const services: Map<string, ChatService> = new Map();

export class ChatService {
  #abortController: AbortController = new AbortController();

  #listeners: Map<string, ChatStateListener> = new Map();

  #state: ChatState = {};

  #currentFunctionInstructions: {
    name: string;
    arguments: string;
  } = { name: '', arguments: '' };

  private constructor(
    private storageProvider: StorageProvider,
    private apiService: ApiService,
    private assistantId: string,
  ) {}

  public static getInstance(
    storageProvider: StorageProvider,
    apiService: ApiService,
    assistantId: string,
  ): ChatService {
    if (services.has(assistantId)) {
      return services.get(assistantId) as ChatService;
    }

    services.set(
      assistantId,
      new ChatService(storageProvider, apiService, assistantId),
    );

    return services.get(assistantId) as ChatService;
  }

  registerStateListener(callback: (state: ChatState) => void): void {
    const cbHash = hash(callback);

    if (this.#listeners.has(cbHash)) {
      return;
    }

    this.#listeners.set(cbHash, callback);
  }

  unregisterStateListener(callback: (state: ChatState) => void): void {
    const cbHash = hash(callback);

    if (!this.#listeners.has(cbHash)) {
      return;
    }

    this.#listeners.delete(cbHash);
  }

  updateState(state: ChatState): void {
    this.#state = { ...this.#state, ...state };

    for (const listener of this.#listeners.values()) {
      listener(this.#state);
    }
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
    this.#abortController.abort();
    this.#abortController = new AbortController();

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

    this.updateState({ receivingInProgress: false });
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
    await this.storageProvider.createChunk(doneChunk);

    this.updateState({
      lastMessage: {
        role,
        content: (messageChunk.content as ChunkContentData).message,
        timestamp: Date.now(),
        finished: true,
      },
      error: undefined,
    });

    const sessionHistory = await this.getSessionHistory();

    const messages =
      role === 'system'
        ? sessionHistory.concat(promptServiceMessages)
        : sessionHistory;

    await this.onMessageSubmit(messages);
  }

  private async processResponse(response: ApiResponse): Promise<void> {
    try {
      switch (response.kind) {
        case ApiResponseType.Done: {
          if (!this.#state.activeMessage?.content) {
            return;
          }

          await this.storageProvider.createChunk({
            content: { kind: ChunkContentKind.DONE },
            role: 'assistant',
            assistantId: this.assistantId,
          });

          return;
        }

        case ApiResponseType.Function: {
          this.#currentFunctionInstructions.name += response.name ?? '';
          this.#currentFunctionInstructions.arguments +=
            response.arguments ?? '';
          return;
        }

        case ApiResponseType.Data: {
          await this.storageProvider.createChunk({
            role: 'assistant',
            assistantId: this.assistantId,
            content: {
              kind: ChunkContentKind.DATA,
              message: response.message,
            },
          });

          if (!this.#state.activeMessage) {
            this.updateState({
              activeMessage: {
                role: 'assistant',
                content: response.message,
                timestamp: Date.now(),
                finished: false,
              },
            });
          } else {
            this.updateState({
              activeMessage: {
                ...this.#state.activeMessage,
                content: this.#state.activeMessage.content + response.message,
              },
            });
          }

          return;
        }

        case ApiResponseType.FunctionCall: {
          const requestedFunction = functionMap.get(
            this.#currentFunctionInstructions.name,
          );

          if (requestedFunction) {
            const functionResponse = await requestedFunction(
              JSON.parse(this.#currentFunctionInstructions.arguments),
            );

            const history = await this.getSessionHistory();
            history.push({
              role: 'function',
              functionName: this.#currentFunctionInstructions.name,
              content: JSON.stringify(functionResponse),
              finished: true,
              timestamp: Date.now(),
            });

            this.onMessageSubmit(history);
          }

          this.#currentFunctionInstructions = {
            name: '',
            arguments: '',
          };
        }
      }
    } catch (error) {
      await this.abortEventsReceiving();
      this.updateState({
        error: new GeneralError(),
        receivingInProgress: false,
      });
      this.#currentFunctionInstructions = {
        name: '',
        arguments: '',
      };
    }
  }

  private async onMessageSubmit(messages: ChatMessage[]): Promise<void> {
    const abortCallback = async (): Promise<void> => {
      await this.abortEventsReceiving();
    };

    window.addEventListener('beforeunload', abortCallback);

    try {
      this.updateState({ receivingInProgress: true });
      await this.apiService.sendMessages(
        messages.map(chatMessageToRequestMessage),
        this.processResponse.bind(this),
        this.#abortController.signal,
      );
    } catch (error) {
      if (error instanceof ApiError || error instanceof TimeoutError) {
        await this.abortEventsReceiving();
        this.updateState({ error });
      }
    } finally {
      // @todo - receiving in progress flickers if GPT got a function to call. find a way to fix it
      this.updateState({
        receivingInProgress: false,
        lastMessage: this.#state.activeMessage
          ? { ...this.#state.activeMessage, finished: true }
          : this.#state.lastMessage,
        activeMessage: undefined,
      });
      window.removeEventListener('beforeunload', abortCallback);
    }
  }
}
