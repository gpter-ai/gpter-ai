import { useLiveQuery } from 'dexie-react-hooks';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant } from '../types';
import { generateUUID } from '../utils';

const prefillAssistants: Assistant[] = [
  {
    id: generateUUID(),
    name: 'General Assistant',
    prompt: '',
    creation_date: new Date(),
    last_update: new Date(),
  },
];

type UseAssistants = {
  assistants: Assistant[];
  prefill: () => void;
};

export const useAssistants = (): UseAssistants => {
  const storageProvider = useStorageProvider();

  const assistants = useLiveQuery(
    () => storageProvider.getAssistants(),
    [storageProvider],
    [],
  );

  const prefill = (): void => {
    prefillAssistants.forEach((assistant) =>
      storageProvider.createAssistant(assistant),
    );
  };

  return { assistants, prefill };
};
