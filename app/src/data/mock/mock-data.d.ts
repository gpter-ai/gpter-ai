import { Assistant, Chunk } from '../types';

declare module 'mock-data' {
  const assistants: Assistant[];
  const chunks: Chunk[];
  export = { assistants, chunks };
}
