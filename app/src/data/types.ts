export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creation_date?: Date;
  last_update?: Date;
};

export type AssistantFormFields = Pick<Assistant, 'name' | 'prompt'>;

export type ChatGptRole = 'user' | 'assistant' | 'system';

export enum ChunkContentKind {
  ERROR = 'error',
  DATA = 'data',
  DONE = 'done',
  ABORT = 'abort',
}

type ChunkContentError = {
  kind: ChunkContentKind.ERROR;
  message: string;
};

type ChunkContentData = {
  kind: ChunkContentKind.DATA;
  message: string;
};

type ChunkContentDone = {
  kind: ChunkContentKind.DONE;
};

type ChunkContentAbort = {
  kind: ChunkContentKind.ABORT;
};

export type ChunkContent =
  | ChunkContentError
  | ChunkContentData
  | ChunkContentDone
  | ChunkContentAbort;

export type Chunk = {
  id: string;
  assistantId: string;
  timestamp: number;
  content: ChunkContent;
  role: ChatGptRole;
};

export type UserConfig = {
  apiKey: string;
  // @TODO - currently this is not used
  maxTokens: number;
};
