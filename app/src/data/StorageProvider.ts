import { Nullable } from '@/types';
import { Assistant, AssistantFormFields, Chunk, UserConfig } from './types';

export interface StorageProvider {
  getAssistants(): Promise<Assistant[]>;
  createAssistant(data: AssistantFormFields): void;
  createChunk(data: Omit<Chunk, 'id'>): void;
  updateAssistant(key: string, data: AssistantFormFields): void;
  deleteAssistant(key: string): Promise<void>;
  getDefaultAssistant(): Promise<Nullable<Assistant>>;
  getChunksByAssistant(assistantId: string): Promise<Chunk[]>;
  putUserConfig(config: UserConfig): void;
  getUserConfig(): Promise<Nullable<UserConfig>>;
}
