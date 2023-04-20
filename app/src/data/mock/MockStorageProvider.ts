import { StorageProvider } from '../StorageProvider';
import { Message } from '../types';

import data from './mock-data.json';

export class MockstorageProvider implements StorageProvider {
  getAssistants() {
    return Promise.resolve(data.assistants);
  }

  createAssistant(): void {}

  updateAssistant(): void {}

  deleteAssistant(): void {}

  getDefaultAssistant() {
    return Promise.resolve(data.assistants[0]);
  }

  getMessagesByAssistant(assistantId: string) {
    const messages = data.messages.filter(
      (message) => message.assistantId === assistantId,
    );

    return Promise.resolve(messages) as Promise<Message[]>;
  }
}
