import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';
import {
  ChatCompletionResponseMessage,
  CreateChatCompletionResponseChoicesInner,
} from 'openai/api';
import { StorageProvider } from '@/data';

export interface ApiServiceConstructor {
  checkApiKey(apiKey: string): Promise<'valid' | 'invalid' | 'error'>;
  new (storageProvider: StorageProvider): ApiService;
}

export interface ApiService {
  sendMessages(
    messages: Array<ChatCompletionRequestMessage>,
    onResponse: (response: ApiResponse) => void,
    abortSignal?: AbortSignal,
  ): Promise<void>;
}

export enum ApiResponseType {
  Done = 'Done',
  Data = 'Data',
  Function = 'Function',
  FunctionCall = 'FunctionCall',
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
  message: string;
}

export interface ApiResponseFunction {
  kind: ApiResponseType.Function;
  name?: string;
  arguments?: string;
}

export interface ApiResponseFunctionCall {
  kind: ApiResponseType.FunctionCall;
}

export type ApiResponse =
  | ApiResponseFinish
  | ApiResponseData
  | ApiResponseFunction
  | ApiResponseFunctionCall;
