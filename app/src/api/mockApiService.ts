import { ChatCompletionRequestMessage } from 'openai';
import { ApiService } from './types';

export class MockApiService implements ApiService {
  async sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('MockApiService.sendMessages', messages);
  }
}
