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
    onAbort?: () => Promise<void>,
  ): Promise<void>;
}

export enum ApiResponseType {
  Done = 'Done',
  Data = 'Data',
}

export interface ApiResponseFinish {
  kind: ApiResponseType.Done;
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
  // TODO: wait for types to be fixed
  // https://github.com/openai/openai-node/issues/74
  message: string;
}

export type ApiResponse = ApiResponseFinish | ApiResponseData;
