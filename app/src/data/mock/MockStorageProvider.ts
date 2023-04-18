import { StorageProvider } from '../StorageProvider';

import data from './mock-data.json';

// @TODO - should these calls be async?
export class MockstorageProvider implements StorageProvider {
  getAssistants() {
    return data.assistants;
  }

  getDefaultAssistant() {
    return data.assistants[0];
  }

  getQueriesByAssistant(assistantId: string) {
    return data.queries.filter((query) => query.assistantId === assistantId);
  }
}
