import { Assistant, Query } from '../types';

declare module 'mock-data' {
  const assistants: Assistant[];
  const queries: Query[];
  export = { assistants, queries };
}
