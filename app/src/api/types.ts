import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';

export interface ApiService {
  sendMessages(messages: Array<ChatCompletionRequestMessage>): Promise<void>;
}

export enum ApiResponseType {
  Done = 'Done',
  Data = 'Data',
}

export interface ApiResponseFinish {
  kind: ApiResponseType.Done;
}

export interface ApiResponseData {
  kind: ApiResponseType.Data;
  data: CreateChatCompletionResponse;
}

export type ApiResponse = ApiResponseFinish | ApiResponseData;

export interface ApiResponseConsumer {
  processResponse(response: ApiResponse): void;
}
