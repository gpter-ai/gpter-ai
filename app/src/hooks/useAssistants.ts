import { useLiveQuery } from 'dexie-react-hooks';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant } from '../data/types';

type UseAssistants = {
  assistants: Assistant[];
};

export const useAssistants = (): UseAssistants => {
  const storageProvider = useStorageProvider();

  const assistants = useLiveQuery(
    () => storageProvider.getAssistants(),
    [storageProvider],
    [],
  );

  return { assistants };
};
