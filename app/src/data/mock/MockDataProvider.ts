import { DataProvider } from '../DataProvider';
import { StorageProvider } from '../StorageProvider';

export class MockDataProvider implements DataProvider {
  #storageProvider;

  constructor(storageProvider: StorageProvider) {
    this.#storageProvider = storageProvider;
  }

  getAssistants() {
    return this.#storageProvider.getAssistants();
  }

  getDefaultAssistant() {
    return this.#storageProvider.getDefaultAssistant();
  }

  getQueriesByAssistant(assistantId: string) {
    return this.#storageProvider.getQueriesByAssistant(assistantId);
  }
}
