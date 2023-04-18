import { Assistant, Query } from './types';

export interface StorageProvider {
  getAssistants(): Assistant[];
  getDefaultAssistant(): Assistant;
  getQueriesByAssistant(assistantId: string): Query[];
}
