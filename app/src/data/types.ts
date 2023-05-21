export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creationDate?: Date;
  lastPromptUpdate?: Date;
  order: number;
};

export type AssistantFormFields = Pick<
  Assistant,
  'name' | 'prompt' | 'lastPromptUpdate'
>;

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
  id: number;
  assistantId: string;
  timestamp: number;
  content: ChunkContent;
  role: ChatGptRole;
};

export type PartialChunkData = Omit<Chunk, 'id' | 'timestamp'>;

export type UserConfig = {
  apiKey: string;
};
