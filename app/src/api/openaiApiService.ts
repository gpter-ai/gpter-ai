import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from 'openai';
import {
  BASE_OPENAI_URL,
  DATA_STREAM_DONE_INDICATOR,
  OPENAI_MODEL,
} from './constants';
import {
  ApiResponse,
  ApiResponsePayload,
  ApiResponseType,
  ApiService,
} from './types';
import { DEFAULT_MAX_TOKENS } from '@/components/constants';

export class OpenAiApiService implements ApiService {
  constructor(private apiKey: string) {}

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
    onAbort?: (messageIndex: number) => Promise<void>,
  ): Promise<void> {
    const requestParam: CreateChatCompletionRequest = {
      model: OPENAI_MODEL,
      messages,
      stream: true,
      max_tokens: DEFAULT_MAX_TOKENS,
    };

    const headers = {
      authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    // @TODO - consider replacing this by introducing auto incremented field
    // into the chunks table
    let messageIndex: number = 0;

    const abortController = new AbortController();
    const { signal } = abortController;

    const onAbortCallback = async (): Promise<void> => {
      abortController.abort();
      onAbort && (await onAbort(messageIndex));
    };

    await fetchEventSource(`${BASE_OPENAI_URL}v1/chat/completions`, {
      method: 'POST',
      body: JSON.stringify(requestParam),
      headers,
      async onopen() {
        messageIndex = 0;
        window.addEventListener('beforeunload', onAbortCallback);
      },
      onclose: () => {
        window.removeEventListener('beforeunload', onAbortCallback);
      },
      onerror: () => {
        window.removeEventListener('beforeunload', onAbortCallback);
      },
      onmessage: (msg) => {
        messageIndex++;

        const apiResponse: ApiResponse =
          msg.data === DATA_STREAM_DONE_INDICATOR
            ? { kind: ApiResponseType.Done, messageIndex }
            : {
                kind: ApiResponseType.Data,
                data: JSON.parse(msg.data) as ApiResponsePayload,
                messageIndex,
              };
        onResponse(apiResponse);
      },
      signal,
    });
  }
}
