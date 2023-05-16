import {
  FC,
  ReactNode,
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

type Props = { children: ReactNode };

type KeyContextValue = {
  shiftPressed: boolean;
};

const KeyContext = createContext<KeyContextValue>({
  shiftPressed: false,
});

export const KeysProvider: FC<Props> = ({ children }) => {
  const [shiftPressed, setShiftPressed] = useState(false);

  const contextValue: KeyContextValue = useMemo(
    () => ({ shiftPressed }),
    [shiftPressed],
  );

  const keydownCallback = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Shift') {
      setShiftPressed(true);
    }
  }, []);

  const keyupCallback = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Shift') {
      setShiftPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keydownCallback);
    window.addEventListener('keyup', keyupCallback);

    return () => {
      window.removeEventListener('keydown', keydownCallback);
      window.removeEventListener('keyup', keyupCallback);
    };
  }, [keydownCallback, keyupCallback]);

  return (
    <KeyContext.Provider value={contextValue}>{children}</KeyContext.Provider>
  );
};

export const useKeysProvider = (): KeyContextValue => useContext(KeyContext);
