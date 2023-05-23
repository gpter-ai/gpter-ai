import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant } from '../data/types';
import { Nullable } from '@/types';
import { sortAssistants } from '@/utils/assistants';

type UseAssistantsContextValue = {
  assistants: Assistant[];
  selectAssistantById: (id: string) => void;
  selectDefaultAssistant: (omitId?: string) => void;
  selectedAssistant: Nullable<Assistant>;
  setSelectedAssistant: (assistant: Nullable<Assistant>) => void;
};

const AssistantsContext = createContext<UseAssistantsContextValue>(
  {} as UseAssistantsContextValue,
);

type Props = { children: ReactNode };

export const AssistantsProvider: FC<Props> = ({ children }) => {
  const [selectedAssistant, setSelectedAssistant] =
    useState<Nullable<Assistant>>();

  const [initialSelectionDone, setInitialSelectionDone] = useState(false);

  const storageProvider = useStorageProvider();

  const assistants = sortAssistants(
    useLiveQuery(() => storageProvider.getAssistants(), [storageProvider], []),
  );

  const selectDefaultAssistant = useCallback(
    (omitId?: string): void => {
      if (omitId) {
        setSelectedAssistant(
          assistants[assistants.findIndex((a) => a.id !== omitId)],
        );
      } else {
        setSelectedAssistant(assistants[0]);
      }
    },
    [assistants],
  );

  useEffect(() => {
    if (!initialSelectionDone && !selectedAssistant && assistants.length > 0) {
      setInitialSelectionDone(true);
      selectDefaultAssistant();
    }
  }, [
    assistants,
    selectDefaultAssistant,
    initialSelectionDone,
    selectedAssistant,
  ]);

  useEffect(() => {
    if (selectedAssistant) {
      setSelectedAssistant(
        assistants.find((a) => a.id === selectedAssistant.id),
      );
    }
  }, [assistants]);

  const selectAssistantById = useCallback(
    (id: string): void => {
      setSelectedAssistant(assistants.find((assistant) => assistant.id === id));
    },
    [assistants],
  );

  const contextValue: UseAssistantsContextValue = useMemo(
    () => ({
      assistants,
      selectAssistantById,
      selectDefaultAssistant,
      selectedAssistant,
      setSelectedAssistant,
    }),
    [
      assistants,
      selectAssistantById,
      selectDefaultAssistant,
      selectedAssistant,
    ],
  );

  return (
    <AssistantsContext.Provider value={contextValue}>
      {children}
    </AssistantsContext.Provider>
  );
};

export const useAssistantsProvider = (): UseAssistantsContextValue =>
  useContext(AssistantsContext);
