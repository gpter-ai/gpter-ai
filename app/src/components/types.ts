import { ChatGptRole } from '@/data/types';

export type ChatMessage = {
  role: ChatGptRole;
  content: string;
  finished: boolean;
  timestamp: number;
};
