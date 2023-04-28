import { ChatGptRole } from '@/data/types';

export type ChatMessage = {
  role: ChatGptRole;
  content: string;
  timestamp: number;
};
