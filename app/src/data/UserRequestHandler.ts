import { DataProvider } from '@/data/DataProvider';
import {
  ApiResponse,
  ApiResponseConsumer,
  ApiResponseType,
  ApiService,
} from '@/api/types';
import { MockApiService } from '@/api/mockApiService';

type TempCallBack = (message: string) => void;

export class UserRequestHandler implements ApiResponseConsumer {
  #apiService: ApiService;

  constructor(
    private dataProvider: DataProvider,
    private assistantId: string,
    private tempCallback: TempCallBack,
  ) {
    this.#apiService = new MockApiService(this);
  }

  processResponse(response: ApiResponse): void {
    this.dataProvider.createChunk({
      content: JSON.stringify(response),
      role: 'assistant',
      assistantId: this.assistantId,
      timestamp: new Date().getDate(),
    });

    console.log(response);

    // TODO temp logic

    if (response.kind === ApiResponseType.Data) {
      this.tempCallback(response.data?.choices[0]?.message?.content ?? '');
    }
  }

  public async processUserMessage(message: string): Promise<void> {
    this.dataProvider.createChunk({
      content: message,
      role: 'user',
      assistantId: this.assistantId,
      timestamp: new Date().getDate(),
    });
    this.tempCallback(message);
    await this.#apiService.sendMessages([
      {
        content: message,
        role: 'user',
      },
    ]);
  }
}
