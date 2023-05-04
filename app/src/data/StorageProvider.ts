import { Nullable } from '@/types';
import {
  Assistant,
  AssistantFormFields,
  Chunk,
  PartialChunkData,
  UserConfig,
} from './types';

export interface StorageProvider {
  getAssistants(): Promise<Assistant[]>;
  getAssistant(key: string): Promise<Nullable<Assistant>>;
  createAssistant(data: AssistantFormFields): void;
  createChunk(data: PartialChunkData): void;
  updateAssistant(key: string, data: AssistantFormFields): void;
  deleteAssistant(key: string): Promise<void>;
  getChunksByAssistant(assistantId: string): Promise<Chunk[]>;
  getChunksByFilter(filter: (chunk: Chunk) => boolean): Promise<Chunk[]>;
  putUserConfig(config: UserConfig): void;
  getUserConfig(): Promise<Nullable<UserConfig>>;
}
