import { ChatGptRole } from '@/data/types';

export type ChatMessage = {
  role: ChatGptRole;
  content: string;
  functionName?: string;
  finished: boolean;
  timestamp: number;
};
