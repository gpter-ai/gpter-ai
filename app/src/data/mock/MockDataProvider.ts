import { Nullable } from '@/types';
import { DataProvider } from '../DataProvider';
import { StorageProvider } from '../StorageProvider';
import { Assistant, AssistantFormFields, Chunk, UserConfig } from '../types';
import { generateUUID } from '../utils';

export class MockDataProvider implements DataProvider {
  #storageProvider;

  constructor(storageProvider: StorageProvider) {
    this.#storageProvider = storageProvider;
  }

  getAssistants(): Promise<Assistant[]> {
    return this.#storageProvider.getAssistants();
  }

  createAssistant(data: AssistantFormFields): void {
    this.#storageProvider.createAssistant({ ...data, id: generateUUID() });
  }

  createChunk(data: Omit<Chunk, 'id'>): void {
    this.#storageProvider.createChunk({ ...data, id: generateUUID() });
  }

  updateAssistant(key: string, data: AssistantFormFields): void {
    this.#storageProvider.updateAssistant(key, data);
  }

  deleteAssistant(key: string): void {
    this.#storageProvider.deleteAssistant(key);
  }

  getDefaultAssistant(): Promise<Nullable<Assistant>> {
    return this.#storageProvider.getDefaultAssistant();
  }

  getChunksByAssistant(assistantId: string): Promise<Chunk[]> {
    return this.#storageProvider.getChunksByAssistant(assistantId);
  }

  putUserConfig(config: UserConfig): void {
    this.#storageProvider.putUserConfig(config);
  }

  getUserConfig(): Promise<Nullable<UserConfig>> {
    return this.#storageProvider.getUserConfig();
  }
}
