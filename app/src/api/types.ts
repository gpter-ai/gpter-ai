import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';
import {
  ChatCompletionResponseMessage,
  CreateChatCompletionResponseChoicesInner,
} from 'openai/api';

export interface ApiService {
  sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
  ): Promise<void>;
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
  // TODO: fix types properly
  data: Omit<CreateChatCompletionResponse, 'choices'> & {
    choices: Array<
      Omit<CreateChatCompletionResponseChoicesInner, 'message'> & {
        delta: ChatCompletionResponseMessage;
      }
    >;
  };
}

export type ApiResponse = ApiResponseFinish | ApiResponseData;
