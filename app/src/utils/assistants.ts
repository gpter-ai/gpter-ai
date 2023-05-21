import { Assistant } from '@/data/types';

export const sortAssistants = (assistants: Assistant[]): Assistant[] =>
  assistants.sort((a, b) => a.order - b.order);
