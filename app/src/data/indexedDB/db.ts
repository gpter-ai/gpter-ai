import Dexie, { Table } from 'dexie';
import { Assistant, Chunk } from '../types';

export class GPTerDexie extends Dexie {
  assistants!: Table<Assistant>;

  chunks!: Table<Chunk>;

  assistantIndexedFields: (keyof Assistant | `++${keyof Assistant}`)[] = [
    '++id',
  ];

  chunkIndexedFields: (keyof Chunk | `++${keyof Chunk}`)[] = [
    '++id',
    'assistantId',
    'timestamp',
  ];

  constructor() {
    super('GPTer');
    this.version(1).stores({
      assistants: `${this.assistantIndexedFields.join(', ')}`,
      chunks: `${this.chunkIndexedFields.join(', ')}`,
    });
  }
}

export const db = new GPTerDexie();
