import { StorageProvider } from '../StorageProvider';
import { Message } from '../types';

import data from './mock-data.json';

// @TODO - should these calls be async?
export class MockstorageProvider implements StorageProvider {
  getAssistants() {
    return data.assistants;
  }

  getDefaultAssistant() {
    return data.assistants[0];
  }

  getMessagesByAssistant(assistantId: string) {
    return data.messages.filter(
      (message) => message.assistantId === assistantId,
    ) as Message[];
  }
}
