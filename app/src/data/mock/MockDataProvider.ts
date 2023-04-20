import { DataProvider } from '../DataProvider';
import { StorageProvider } from '../StorageProvider';
import { AssistantFormFields } from '../types';

export class MockDataProvider implements DataProvider {
  #storageProvider;

  constructor(storageProvider: StorageProvider) {
    this.#storageProvider = storageProvider;
  }

  getAssistants() {
    return this.#storageProvider.getAssistants();
  }

  createAssistant(data: AssistantFormFields) {
    this.#storageProvider.createAssistant(data);
  }

  updateAssistant(key: string, data: AssistantFormFields) {
    this.#storageProvider.updateAssistant(key, data);
  }

  deleteAssistant(key: string) {
    this.#storageProvider.deleteAssistant(key);
  }

  getDefaultAssistant() {
    return this.#storageProvider.getDefaultAssistant();
  }

  getMessagesByAssistant(assistantId: string) {
    return this.#storageProvider.getMessagesByAssistant(assistantId);
  }
}
