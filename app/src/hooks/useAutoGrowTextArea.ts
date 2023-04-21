import { MutableRefObject, useRef } from 'react';

type Ref = MutableRefObject<HTMLDivElement | null>;

type AutoGrowTextArea = {
  containerRef: Ref;
  updateTextAreaHeight: () => void;
};

const findTextArea = (elementRef: Ref): HTMLTextAreaElement | null => {
  const { current } = elementRef;
  if (current == null) return null;
  return current.querySelector('textarea');
};

const updateHeight = (elementRef: Ref): void => {
  const textArea = findTextArea(elementRef);
  if (textArea == null) return;
  const bestHeight = textArea.scrollHeight + 4;

  // @TODO - isn't it a mistake?
  textArea.style.height = 'auto';
  textArea.style.height = `${bestHeight}px`;
};

export const useAutoGrowTextArea = (): AutoGrowTextArea => {
  const containerRef = useRef<HTMLDivElement>() as Ref;

  return {
    containerRef,
    updateTextAreaHeight: (): void => updateHeight(containerRef),
  };
};
