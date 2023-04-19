import { Assistant, Message } from './types';

export interface StorageProvider {
  getAssistants(): Assistant[];
  getDefaultAssistant(): Assistant;
  getMessagesByAssistant(assistantId: string): Message[];
}
