import Dexie, { Table } from 'dexie';
import { Assistant, Message } from '../types';

export class GPTerDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  assistants!: Table<Assistant>;

  messages!: Table<Message>;

  assistantIndexedFields: (keyof Assistant | `++${keyof Assistant}`)[] = [
    '++id',
  ];

  messageIndexedFields: (keyof Message | `++${keyof Message}`)[] = [
    '++id',
    'assistantId',
    'timestamp',
  ];

  constructor() {
    super('GPTer');
    this.version(1).stores({
      assistants: `${this.assistantIndexedFields.join(', ')}`,
      messages: `${this.messageIndexedFields.join(', ')}`,
    });
  }
}

export const db = new GPTerDexie();
