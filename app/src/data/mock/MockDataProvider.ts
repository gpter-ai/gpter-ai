import { Nullable } from '@/types';
import { DataProvider } from '../DataProvider';
import { StorageProvider } from '../StorageProvider';
import { Assistant, AssistantFormFields, Message } from '../types';

export class MockDataProvider implements DataProvider {
  #storageProvider;

  constructor(storageProvider: StorageProvider) {
    this.#storageProvider = storageProvider;
  }

  getAssistants(): Promise<Assistant[]> {
    return this.#storageProvider.getAssistants();
  }

  createAssistant(data: AssistantFormFields): void {
    this.#storageProvider.createAssistant(data);
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

  getMessagesByAssistant(assistantId: string): Promise<Message[]> {
    return this.#storageProvider.getMessagesByAssistant(assistantId);
  }
}
