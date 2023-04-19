import { Assistant, Message } from './types';

export interface DataProvider {
  // @TODO - a single get() operation that infers return value from the first arg which is the collection name
  getAssistants(): Assistant[];
  getDefaultAssistant(): Assistant;
  getMessagesByAssistant(assistantId: string): Message[];
}
