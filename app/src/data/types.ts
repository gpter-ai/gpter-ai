export type Assistant = {
  id?: string;
  name: string;
  prompt: string;
  creation_date?: Date;
  last_update?: Date;
};

export type AssistantFormFields = Pick<Assistant, 'name' | 'prompt'> & {
  id?: string;
};

export type Message = {
  id: string;
  assistantId: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  chunks: string[];
  tokens?: number;
};
