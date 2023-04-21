import { Nullable } from '@/types';
import { StorageProvider } from '../StorageProvider';
import { Assistant, Message } from '../types';

import data from './mock-data.json';

export class MockstorageProvider implements StorageProvider {
  getAssistants(): Promise<Assistant[]> {
    return Promise.resolve(data.assistants);
  }

  createAssistant(): void {}

  updateAssistant(): void {}

  deleteAssistant(): void {}

  getDefaultAssistant(): Promise<Nullable<Assistant>> {
    return Promise.resolve(data.assistants[0]);
  }

  getMessagesByAssistant(assistantId: string): Promise<Message[]> {
    const messages = data.messages.filter(
      (message) => message.assistantId === assistantId,
    );

    return Promise.resolve(messages) as Promise<Message[]>;
  }
}
