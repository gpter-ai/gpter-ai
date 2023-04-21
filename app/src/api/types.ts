import { ChatGptRole, Chunk } from '@/data/types';
import { Nullable } from '@/types';

export interface ApiService {
  postChat(chunks: Chunk[], assistantId: string): void;
}

export type ChatCompletionStreamResponseDelta = {
  content?: string;
  role?: ChatGptRole;
};

export type ChatCompletionStreamResponseChoice = {
  delta: ChatCompletionStreamResponseDelta;
  index: number;
  finish_reason: Nullable<string>;
};

export type ChatCompletionStreamResponseData = {
  id: string;
  object: string;
  created: number;
  moidel: string;
  choices: ChatCompletionStreamResponseChoice[];
};
