export type Assistant = {
  id: string;
  name: string;
  prompt: string;
  creation_date?: Date;
  last_update?: Date;
};

export type Query = {
  id: string;
  assistantId: string;
  timestamp: string;
  content: string;
  response: string;
};
