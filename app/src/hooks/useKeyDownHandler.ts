import { useRef, useEffect } from 'react';

type KeyboardEventHandler = (event: KeyboardEvent) => void;

const useKeyDownHandler = (
  handler: KeyboardEventHandler,
  isHandlerMatch: (e: KeyboardEvent) => boolean,
): void => {
  const eventListenerRef = useRef<KeyboardEventHandler>();

  useEffect(() => {
    eventListenerRef.current = (event) => {
      if (isHandlerMatch(event)) {
        handler(event);
      }
    };
  }, [handler, isHandlerMatch]);

  useEffect(() => {
    const eventListener: KeyboardEventHandler = (event) => {
      eventListenerRef.current && eventListenerRef.current(event);
    };

    window.addEventListener('keydown', eventListener);
    return () => {
      window.removeEventListener('keydown', eventListener);
    };
  }, []);
};

export const useKeydownHandlerByKey = (
  keys: string | string[],
  handler: KeyboardEventHandler,
): void => {
  useKeyDownHandler(handler, (event) =>
    Array.isArray(keys) ? keys.includes(event.key) : keys === event.key,
  );
};

export const useKeydownHandlerByCode = (
  codes: string | string[],
  handler: KeyboardEventHandler,
): void => {
  useKeyDownHandler(handler, (event) =>
    Array.isArray(codes) ? codes.includes(event.code) : codes === event.code,
  );
};
