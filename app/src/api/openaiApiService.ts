import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
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
import {
  ApiResponse,
  ApiResponseConsumer,
  ApiResponseType,
  ApiService,
} from './types';

export class OpenAiApiService implements ApiService {
  constructor(private apiResponseConsumer: ApiResponseConsumer) {}

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
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
      onmessage: (msg) => this.onMessage(msg),
    });
  }

  private processResponse(apiResponse: ApiResponse): void {
    this.apiResponseConsumer.processResponse(apiResponse);
  }

  private onMessage(event: EventSourceMessage): void {
    const apiResponse: ApiResponse =
      event.data === DATA_STREAM_DONE_INDICATOR
        ? { kind: ApiResponseType.Done }
        : {
            kind: ApiResponseType.Data,
            data: JSON.parse(event.data) as CreateChatCompletionResponse,
          };
    this.processResponse(apiResponse);
  }
}
