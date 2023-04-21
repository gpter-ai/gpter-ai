export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creation_date?: Date;
  last_update?: Date;
};

export type AssistantFormFields = Pick<Assistant, 'name' | 'prompt'>;

export type Chunk = {
  id: string;
  assistantId: string;
  timestamp: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
};
