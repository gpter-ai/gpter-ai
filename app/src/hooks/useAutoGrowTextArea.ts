import { MutableRefObject, useEffect, useRef } from 'react';
import autosize from 'autosize';

type Ref = MutableRefObject<HTMLDivElement | null>;

type AutoGrowTextArea = {
  containerRef: Ref;
  update: () => void;
};

const findTextArea = (elementRef: Ref): HTMLTextAreaElement | null => {
  const { current } = elementRef;
  if (current == null) return null;
  return current.querySelector('textarea');
};

export const useAutoGrowTextArea = (): AutoGrowTextArea => {
  const containerRef = useRef<HTMLDivElement>() as Ref;
  const textArea = findTextArea(containerRef);

  const update = (): void => {
    if (textArea) autosize.update(textArea);
  };

  useEffect(() => {
    if (textArea) autosize(textArea);
  }, [textArea]);

  return {
    containerRef,
    update,
  };
};
