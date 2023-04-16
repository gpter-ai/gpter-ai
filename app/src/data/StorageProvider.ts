import { Assistant, Query } from './types';

export interface StorageProvider {
  getAssistants(): Assistant[];
  getQueriesByAssistant(assistantId: string): Query[];
}
