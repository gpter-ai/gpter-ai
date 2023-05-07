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
import UnauhtorizedError from './error/UnauthorizedError';
import GeneralError from './error/GeneralError';

export class OpenAiApiService implements ApiService {
  constructor(private apiKey: string) {}

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
    abortSignal?: AbortSignal,
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

    await fetchEventSource(`${BASE_OPENAI_URL}v1/chat/completions`, {
      method: 'POST',
      body: JSON.stringify(requestParam),
      headers,
      async onopen(response) {
        if (response.ok) {
          return;
        }

        if (response.status === 401) {
          throw new UnauhtorizedError('Unauhtorized. Check your API key!');
        }
      },
      onerror: (error) => {
        if (error instanceof UnauhtorizedError) {
          throw error;
        }

        throw new GeneralError();
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
      signal: abortSignal,
    });
  }

  private extractMessage(data: string): string {
    const payload = JSON.parse(data) as ApiResponsePayload;

    return payload.choices[0]?.delta?.content ?? '';
  }
}
