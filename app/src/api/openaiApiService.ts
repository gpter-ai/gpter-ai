import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { Chunk } from '@/data/types';
import { ApiService, ChatCompletionStreamResponseData } from './types';
import {
  API_KEY,
  OPENAI_MODEL,
  MAX_RESPONSE_TOKENS,
  BASE_OPENAI_URL,
  DATA_STREAM_DONE_INDICATOR,
} from './constants';
import { DataProvider } from '@/data';

export class OpenAiApiService implements ApiService {
  #dataProvider: DataProvider;

  constructor(dataProvider: DataProvider) {
    this.#dataProvider = dataProvider;
  }

  postChat(chunks: Chunk[], assistantId: string): void {
    const body = JSON.stringify({
      model: OPENAI_MODEL,
      stream: true,
      max_tokens: MAX_RESPONSE_TOKENS,
      messages: chunks.map((chunk) => ({
        role: chunk.role,
        content: chunk.content,
      })),
    });

    const headers = {
      authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    const onmessage = (event: EventSourceMessage): void => {
      if (event.data === DATA_STREAM_DONE_INDICATOR) {
        return;
      }

      const data: ChatCompletionStreamResponseData = JSON.parse(event.data);

      const chunk: Omit<Chunk, 'id'> = {
        assistantId,
        timestamp: Date.now(),
        content: data.choices[0].delta.content,
        role: data.choices[0].delta.role,
      };

      this.#dataProvider.createChunk(chunk);
    };

    fetchEventSource(`${BASE_OPENAI_URL}v1/chat/completions`, {
      method: 'POST',
      body,
      headers,
      onmessage,
    });
  }
}
