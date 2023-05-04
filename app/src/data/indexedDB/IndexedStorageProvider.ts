import { Nullable } from '@/types';
import { StorageProvider } from '@/data';
import {
  Assistant,
  AssistantFormFields,
  Chunk,
  PartialChunkData,
  UserConfig,
} from '../types';
import { GPTerDexie } from './db';
import { USER_CONFIG_STORAGE_KEY } from '../constants';
import { generateUUID } from '../utils';

export class IndexedStorageProvider implements StorageProvider {
  #db: GPTerDexie;

  constructor() {
    this.#db = new GPTerDexie();
  }

  getAssistants(): Promise<Assistant[]> {
    return this.#db.assistants.toArray();
  }

  getAssistant(key: string): Promise<Nullable<Assistant>> {
    return this.#db.assistants.get(key);
  }

  createAssistant(data: AssistantFormFields): void {
    // @TODO - think about building in validation layer
    this.#db.assistants.add({
      ...data,
      id: generateUUID(),
    });
  }

  createChunk(data: PartialChunkData): void {
    this.#db.chunks.add({
      ...data,
      timestamp: Date.now(),
    } as Chunk);
  }

  updateAssistant(key: string, data: AssistantFormFields): void {
    this.#db.assistants.update(key, { ...data });
  }

  async deleteAssistant(key: string): Promise<void> {
    await this.#db.chunks.where({ assistantId: key }).delete();
    await this.#db.assistants.delete(key);
  }

  getChunksByAssistant(assistantId: string): Promise<Chunk[]> {
    return this.#db.chunks.where({ assistantId }).toArray();
  }

  getChunksByFilter(filter: (chunk: Chunk) => boolean): Promise<Chunk[]> {
    return this.#db.chunks.filter(filter).toArray();
  }

  putUserConfig(config: UserConfig): void {
    localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }

  getUserConfig(): Promise<Nullable<UserConfig>> {
    const config = localStorage.getItem(USER_CONFIG_STORAGE_KEY);

    return Promise.resolve(config ? JSON.parse(config) : null);
  }
}
