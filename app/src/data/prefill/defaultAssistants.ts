import { AssistantFormFields } from '../types';

type VisibleProps = {
  description: string;
  title: string;
};

export type DefaultAssistant = AssistantFormFields & VisibleProps;

export const defaultAssistants: ReadonlyArray<DefaultAssistant> = [
  {
    description: 'An assistant for general use',
    title: 'general',
    name: 'General Assistant',
    prompt: '',
  },
  {
    description: 'English vocabulary with example sentences',
    title: 'vocabulary',
    name: 'English vocabulary',
    prompt:
      'You are an English vocabulary. User will input words or sentences in English. Your job is to provide simple explanation of the input with one or two example senteneces. If the user input is not in English - make them aware of it and do not do translation',
  },
  {
    description: 'Create your own assistant just as you like it!',
    title: 'custom',
    name: '',
    prompt: '',
  },
];
