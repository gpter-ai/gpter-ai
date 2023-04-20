import { StorageProvider } from '../StorageProvider';
import { Assistant, AssistantFormFields } from '../types';
import { GPTerDexie } from './db';

export class IndexedStorageProvider implements StorageProvider {
  #db: GPTerDexie;

  constructor() {
    this.#db = new GPTerDexie();
  }

  getAssistants(): Promise<Assistant[]> {
    return this.#db.assistants.toArray();
  }

  createAssistant(data: AssistantFormFields): void {
    this.#db.assistants.add({ ...data });
  }

  updateAssistant(key: string, data: AssistantFormFields): void {
    this.#db.assistants.update(key, { ...data });
  }

  deleteAssistant(key: string): void {
    this.#db.assistants.delete(key);
  }

  getDefaultAssistant() {
    return this.#db.assistants
      .toArray()
      .then((array) => (array.length ? array[0] : null));
  }

  getMessagesByAssistant(assistantId: string) {
    return this.#db.messages.where({ assistantId }).toArray();
  }
}
