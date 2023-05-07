import { ChatCompletionRequestMessage } from 'openai';
import { ApiResponse, ApiResponseType, ApiService } from './types';

const POSTFIX = new Array(100).fill(0).map((x, i) => `Item ${i},`);

const SAMPLE_MESSAGE = [
  'Hello!',
  'How',
  'are',
  'you',
  'doing?',
  'I',
  'am',
  'a',
  'human',
  'and',
  '-',
  'am',
  'not',
  'a',
  'robot!',
  ...POSTFIX,
];

export class MockApiService implements ApiService {
  async checkAuthToken(): Promise<'valid' | 'invalid' | 'error'> {
    return new Promise((resolve) => {
      setTimeout(() => resolve('valid'), 1000);
    });
  }

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
  ): Promise<void> {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index >= SAMPLE_MESSAGE.length) {
        clearInterval(intervalId);
        onResponse({ kind: ApiResponseType.Done });
      } else {
        onResponse(this.createDataResponse(index));
      }
      index += 1;
    }, 50);
  }

  private createDataResponse(index: number): ApiResponse {
    return {
      kind: ApiResponseType.Data,
      message: `${SAMPLE_MESSAGE[index]} `,
    };
  }
}
