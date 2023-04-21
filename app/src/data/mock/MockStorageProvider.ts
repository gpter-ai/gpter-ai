import { Nullable } from '@/types';
import { StorageProvider } from '../StorageProvider';
import { Assistant, Chunk } from '../types';

import data from './mock-data.json';

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
}
