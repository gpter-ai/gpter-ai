import { Nullable } from '@/types';
import { Assistant, AssistantFormFields, Chunk } from './types';

export interface StorageProvider {
  getAssistants(): Promise<Assistant[]>;
  createAssistant(data: AssistantFormFields): void;
  updateAssistant(key: string, data: AssistantFormFields): void;
  deleteAssistant(key: string): void;
  getDefaultAssistant(): Promise<Nullable<Assistant>>;
  getChunksByAssistant(assistantId: string): Promise<Chunk[]>;
}
