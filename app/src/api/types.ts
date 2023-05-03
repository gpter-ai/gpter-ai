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
    onAbort?: (messageIndex: number) => Promise<void>,
  ): Promise<void>;
}

export enum ApiResponseType {
  Done = 'Done',
  Data = 'Data',
}

export interface ApiResponseFinish {
  kind: ApiResponseType.Done;
  messageIndex: number;
}

export type ApiResponseChoice = Omit<
  CreateChatCompletionResponseChoicesInner,
  'message'
> & {
  delta: ChatCompletionResponseMessage;
};

export type ApiResponsePayload = Omit<
  CreateChatCompletionResponse,
  'choices'
> & {
  choices: Array<ApiResponseChoice>;
};

export interface ApiResponseData {
  kind: ApiResponseType.Data;
  messageIndex: number;
  // TODO: fix types properly
  data: ApiResponsePayload;
}

export type ApiResponse = ApiResponseFinish | ApiResponseData;
