import { Assistant } from '@/data/types';

export const sortAssistants = (assistants: Assistant[]): Assistant[] =>
  assistants.sort((a, b) => {
    if (!a.pinnedTime && !b.pinnedTime) {
      return 0;
    }

    if (!a.pinnedTime) {
      return 1;
    }

    if (!b.pinnedTime) {
      return -1;
    }

    return a.pinnedTime.getTime() - b.pinnedTime.getTime();
  });
