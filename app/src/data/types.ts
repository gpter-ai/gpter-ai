export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creation_date?: Date;
  last_update?: Date;
};

export type AssistantFormFields = Pick<Assistant, 'name' | 'prompt'>;

export type ChatGptRole = 'user' | 'assistant' | 'system';

export type Chunk = {
  id: string;
  assistantId: string;
  timestamp: number;
  content?: string;
  role?: ChatGptRole;
};

export type UserConfig = {
  apiKey: string;
};
