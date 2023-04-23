import { Nullable } from '@/types';
import { StorageProvider } from '../StorageProvider';
import { Assistant, Chunk, UserConfig } from '../types';

import data from './mock-data.json';
import { USER_CONFIG_STORAGE_KEY } from './constants';

export class MockstorageProvider implements StorageProvider {
  getAssistants(): Promise<Assistant[]> {
    return Promise.resolve(data.assistants);
  }

  createAssistant(): void {}

  createChunk(): void {}

  updateAssistant(): void {}

  deleteAssistant(): void {}

  getDefaultAssistant(): Promise<Nullable<Assistant>> {
    return Promise.resolve(data.assistants[0]);
  }

  getChunksByAssistant(assistantId: string): Promise<Chunk[]> {
    const chunks = data.chunks.filter(
      (chunk) => chunk.assistantId === assistantId,
    );

    return Promise.resolve(chunks) as Promise<Chunk[]>;
  }

  putUserConfig(config: UserConfig): void {
    localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }

  getUserConfig(): Promise<Nullable<UserConfig>> {
    const config = localStorage.getItem(USER_CONFIG_STORAGE_KEY);

    return Promise.resolve(config ? JSON.parse(config) : null);
  }
}
