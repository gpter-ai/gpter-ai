import { Nullable } from '@/types';
import { Assistant, AssistantFormFields, Chunk, UserConfig } from './types';

export interface DataProvider {
  // assistants
  getAssistants(): Promise<Assistant[]>;
  updateAssistant(key: string, data: AssistantFormFields): void;
  deleteAssistant(key: string): void;
  getDefaultAssistant(): Promise<Nullable<Assistant>>;
  getChunksByAssistant(assistantId: string): Promise<Chunk[]>;
  createAssistant(data: AssistantFormFields): void;
  // chunks
  createChunk(data: Omit<Chunk, 'id'>): void;
  // user config
  putUserConfig(config: UserConfig): void;
  getUserConfig(): Promise<Nullable<UserConfig>>;
}
