import { Assistant, Message } from '../types';

declare module 'mock-data' {
  const assistants: Assistant[];
  const messages: Message[];
  export = { assistants, messages };
}
