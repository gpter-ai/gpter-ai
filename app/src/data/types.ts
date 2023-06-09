export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creationDate?: Date;
  pinnedTime?: Date;
};

export type AssistantFormFields = Pick<Assistant, 'name' | 'prompt'>;

export type ChatGptRole = 'user' | 'assistant' | 'system' | 'function';

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

export type ChunkContentData = {
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
  id: number;
  assistantId: string;
  timestamp: number;
  content: ChunkContent;
  role: ChatGptRole;
};

export type PartialChunkData = Omit<Chunk, 'id' | 'timestamp'>;

export type UserConfig = {
  apiKey: string;
  minimizeOnClose: boolean;
};
