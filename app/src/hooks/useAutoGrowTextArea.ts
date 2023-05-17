import { MutableRefObject, useEffect, useRef } from 'react';
import autosize from 'autosize';

type Ref = MutableRefObject<HTMLDivElement | null>;

type AutoGrowTextArea = {
  containerRef: Ref;
};

const findTextArea = (elementRef: Ref): HTMLTextAreaElement | null => {
  const { current } = elementRef;
  if (current == null) return null;
  return current.querySelector('textarea');
};

export const useAutoGrowTextArea = (): AutoGrowTextArea => {
  const containerRef = useRef<HTMLDivElement>() as Ref;
  const textArea = findTextArea(containerRef);

  useEffect(() => {
    if (textArea) autosize(textArea);
  }, [textArea]);

  return {
    containerRef,
  };
};
