import { ChatMessage } from '@/components/types';

export const promptServiceMessages: ChatMessage[] = [
  {
    content:
      'Please only confirm and repeat the previous prompt in one short clear sentence, speaking from your perspective as my interlocutor, but do not go into detail about it.',
    role: 'user',
    timestamp: Date.now(),
    finished: true,
  },
];
