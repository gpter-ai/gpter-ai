import { DataProvider } from '@/data/DataProvider';
import {
  ApiResponse,
  ApiResponseConsumer,
  ApiResponseType,
  ApiService,
} from '@/api/types';
import { MockApiService } from '@/api/mockApiService';

export class UserRequestHandler implements ApiResponseConsumer {
  #apiService: ApiService;

  constructor(private dataProvider: DataProvider, private assistantId: string) {
    this.#apiService = new MockApiService(this);
  }

  processResponse(response: ApiResponse): void {
    // @TODO temp logic

    if (response.kind === ApiResponseType.Data) {
      const chunkContent = response.data?.choices[0]?.message?.content ?? '';

      this.dataProvider.createChunk({
        content: chunkContent,
        role: 'assistant',
        assistantId: this.assistantId,
        timestamp: Date.now(),
      });
    }
  }

  public async processUserMessage(message: string): Promise<void> {
    this.dataProvider.createChunk({
      content: message,
      role: 'user',
      assistantId: this.assistantId,
      timestamp: Date.now(),
    });

    await this.#apiService.sendMessages([
      {
        content: message,
        role: 'user',
      },
    ]);
  }
}
