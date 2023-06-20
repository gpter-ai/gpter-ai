import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from 'openai';
import {
  API_TIMEOUT,
  BASE_OPENAI_URL,
  DATA_STREAM_DONE_INDICATOR,
  MAX_RESPONSE_TOKENS,
  OPENAI_MODEL,
} from './constants';
import {
  ApiResponse,
  ApiResponsePayload,
  ApiResponseType,
  ApiService,
  ApiServiceConstructor,
} from './types';
import UnauhtorizedError from './error/UnauthorizedError';
import GeneralError from './error/GeneralError';
import { StorageProvider } from '@/data';
import TimeoutError from './error/TimeoutError';
import { functions } from './functions';

const OpenAiApiService: ApiServiceConstructor = class OpenAiApiService
  implements ApiService
{
  constructor(private storageProvider: StorageProvider) {}

  static async checkApiKey(
    apiKey: string,
  ): Promise<'valid' | 'invalid' | 'error'> {
    const headers = {
      authorization: `Bearer ${apiKey}`,
    };

    return fetch(`${BASE_OPENAI_URL}v1/models`, { headers }).then(
      (response) => {
        if (response.status === 401) {
          return 'invalid';
        }

        if (response.ok) {
          return 'valid';
        }

        return 'error';
      },
    );
  }

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    const apiKey = (await this.storageProvider.getUserConfig())?.apiKey;

    const requestParam: CreateChatCompletionRequest = {
      model: OPENAI_MODEL,
      messages,
      functions,
      stream: true,
      max_tokens: MAX_RESPONSE_TOKENS,
    };

    const headers = {
      authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    let timeoutFlag = true;

    const timeoutPromise: Promise<void> = new Promise((_, reject) => {
      setTimeout(() => {
        if (timeoutFlag) {
          reject(
            new TimeoutError(
              'The AI service seems to be unavailable at the moment! Try to repeat your request later.',
            ),
          );
        }
      }, API_TIMEOUT);
    });

    const fetchPromise = fetchEventSource(
      `${BASE_OPENAI_URL}v1/chat/completions`,
      {
        method: 'POST',
        body: JSON.stringify(requestParam),
        headers,
        async onopen(response) {
          timeoutFlag = false;

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
          if (msg.data === DATA_STREAM_DONE_INDICATOR) {
            onResponse({ kind: ApiResponseType.Done });
            return;
          }

          const payload = JSON.parse(msg.data) as ApiResponsePayload;

          if (
            Array.isArray(payload.choices) &&
            payload.choices[0]?.delta?.content
          ) {
            onResponse({
              kind: ApiResponseType.Data,
              message: payload.choices[0].delta.content,
            });

            return;
          }

          if (payload.choices[0].delta.function_call) {
            onResponse({
              kind: ApiResponseType.Function,
              name: payload.choices[0].delta.function_call.name,
              arguments: payload.choices[0].delta.function_call.arguments,
            });

            return;
          }

          if (payload.choices[0].finish_reason === 'function_call') {
            onResponse({
              kind: ApiResponseType.FunctionCall,
            });
          }
        },
        signal: abortSignal,
      },
    );

    return Promise.race([timeoutPromise, fetchPromise]);
  }
};

export default OpenAiApiService;
