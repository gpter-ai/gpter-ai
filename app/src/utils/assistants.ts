import { Assistant } from '@/data/types';

export const sortAssistants = (assistants: Assistant[]): Assistant[] =>
  assistants.sort((a, b) => {
    if (!a.lastMessageDate && !b.lastMessageDate) {
      return a.name.localeCompare(b.name);
    }

    if (!a.lastMessageDate) {
      return 1;
    }

    if (!b.lastMessageDate) {
      return -1;
    }

    return b.lastMessageDate.getTime() - a.lastMessageDate.getTime();
  });
