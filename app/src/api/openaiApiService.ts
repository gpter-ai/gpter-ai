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
    onAbort?: () => void,
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

    const abortController = new AbortController();
    const { signal } = abortController;

    const onAbortCallback = async (): Promise<void> => {
      abortController.abort();
      onAbort && onAbort();
    };

    await fetchEventSource(`${BASE_OPENAI_URL}v1/chat/completions`, {
      method: 'POST',
      body: JSON.stringify(requestParam),
      headers,
      async onopen() {
        window.addEventListener('beforeunload', onAbortCallback);
      },
      onclose: () => {
        window.removeEventListener('beforeunload', onAbortCallback);
      },
      onerror: () => {
        window.removeEventListener('beforeunload', onAbortCallback);
      },
      onmessage: (msg) => {
        const apiResponse: ApiResponse =
          msg.data === DATA_STREAM_DONE_INDICATOR
            ? { kind: ApiResponseType.Done }
            : {
                kind: ApiResponseType.Data,
                message: this.extractMessage(msg.data),
              };
        onResponse(apiResponse);
      },
      signal,
    });
  }

  private extractMessage(data: string): string {
    const payload = JSON.parse(data) as ApiResponsePayload;

    return payload.choices[0]?.delta?.content ?? '';
  }
}
