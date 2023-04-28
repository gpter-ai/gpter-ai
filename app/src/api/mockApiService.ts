import { ChatCompletionRequestMessage } from 'openai';
import { ApiResponse, ApiResponseType, ApiService } from './types';

const SAMPLE_MESSAGE = [
  'Hello! ',
  'How ',
  'are ',
  'you ',
  'doing? ',
  'I ',
  'am ',
  'a ',
  'human ',
  'and ',
  '- ',
  'am ',
  'not ',
  'a ',
  'robot!',
];

export class MockApiService implements ApiService {
  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
  ): Promise<void> {
    console.log('sending following messages', messages);
    let index = 0;
    const intervalId = setInterval(() => {
      if (index >= SAMPLE_MESSAGE.length) {
        clearInterval(intervalId);
        onResponse({ kind: ApiResponseType.Done });
      } else {
        onResponse(this.createDataResponse(index));
      }
      index += 1;
    }, 500);
  }

  private createDataResponse(index: number): ApiResponse {
    return {
      kind: ApiResponseType.Data,
      data: {
        created: new Date().getDate(),
        object: 'message',
        model: 'Mock',
        id: '123',
        choices: [
          {
            message: {
              content: SAMPLE_MESSAGE[index],
              role: 'assistant',
            },
          },
        ],
      },
    };
  }
}
