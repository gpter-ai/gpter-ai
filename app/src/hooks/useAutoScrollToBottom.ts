import { DependencyList, MutableRefObject, useEffect, useRef } from 'react';

type Ref = MutableRefObject<HTMLDivElement | null>;

export const useAutoScrollToBottom = (deps: DependencyList): Ref => {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollTop = ref.current.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref as Ref;
};
