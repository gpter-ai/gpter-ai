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

  createAssistant(data: AssistantFormFields): Promise<Assistant> {
    // @TODO - think about building in validation layer
    const assistant = {
      ...data,
      id: generateUUID(),
      creationDate: new Date(),
    };

    return this.#db.assistants.add(assistant).then(() => assistant);
  }

  createChunk(data: PartialChunkData): void {
    this.#db.chunks.add({
      ...data,
      timestamp: Date.now(),
    } as Chunk);
  }

  updateAssistant(key: string, data: Partial<AssistantFormFields>): void {
    this.#db.assistants.update(key, { ...data, lastUpdate: new Date() });
  }

  async deleteAssistant(key: string): Promise<void> {
    await this.#db.chunks.where({ assistantId: key }).delete();
    await this.#db.assistants.delete(key);
  }

  getChunksByAssistant(assistantId: string): Promise<Chunk[]> {
    return this.#db.chunks.where({ assistantId }).toArray();
  }

  getLastChunkByAssistant(assistantId: string): Promise<Nullable<Chunk>> {
    return this.#db.chunks
      .where({ assistantId })
      .reverse()
      .sortBy('timestamp')
      .then((chunks) => (chunks.length ? chunks[0] : null));
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

  async pinAssistant(id: string): Promise<void> {
    this.#db.assistants.update(id, { pinnedTime: new Date() });
  }

  async unpinAssistant(id: string): Promise<void> {
    this.#db.assistants.update(id, { pinnedTime: null });
  }

  async getLastChunk(assistantId: string): Promise<Nullable<Chunk>> {
    return this.#db.chunks
      .orderBy('timestamp')
      .filter((x) => x.assistantId === assistantId)
      .last();
  }
}
