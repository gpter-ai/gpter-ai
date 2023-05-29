import { ChatCompletionRequestMessage } from 'openai';
import {
  ApiResponse,
  ApiResponseType,
  ApiService,
  ApiServiceConstructor,
} from './types';

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

export const MockApiService: ApiServiceConstructor = class MockApiService
  implements ApiService
{
  static async checkApiKey(): Promise<'valid' | 'invalid' | 'error'> {
    return new Promise((resolve) => {
      setTimeout(() => resolve('valid'), 1000);
    });
  }

  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let index = 0;
        const intervalId = setInterval(() => {
          if (index >= SAMPLE_MESSAGE.length) {
            clearInterval(intervalId);
            onResponse({ kind: ApiResponseType.Done });
            resolve();
          } else {
            onResponse(this.createDataResponse(index));
          }
          index += 1;
        }, 50);
      }, 500);
    });
  }

  private createDataResponse(index: number): ApiResponse {
    return {
      kind: ApiResponseType.Data,
      message: `${SAMPLE_MESSAGE[index]} `,
    };
  }
};
