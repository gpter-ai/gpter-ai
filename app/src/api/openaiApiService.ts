import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from 'openai';
import {
  API_KEY,
  BASE_OPENAI_URL,
  DATA_STREAM_DONE_INDICATOR,
  OPENAI_MODEL,
} from './constants';
import { ApiResponse, ApiResponseType, ApiService } from './types';

export class OpenAiApiService implements ApiService {
  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
  ): Promise<void> {
    const requestParam: CreateChatCompletionRequest = {
      model: OPENAI_MODEL,
      messages,
      stream: true,
    };

    const headers = {
      authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    await fetchEventSource(`${BASE_OPENAI_URL}v1/chat/completions`, {
      method: 'POST',
      body: JSON.stringify(requestParam),
      headers,
      onmessage: (msg) => {
        const apiResponse: ApiResponse =
          msg.data === DATA_STREAM_DONE_INDICATOR
            ? { kind: ApiResponseType.Done }
            : {
                kind: ApiResponseType.Data,
                data: JSON.parse(msg.data) as CreateChatCompletionResponse,
              };
        onResponse(apiResponse);
      },
    });
  }
}
