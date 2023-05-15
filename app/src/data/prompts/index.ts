import defaultPrompts from './prompts.json';
import { Prompt } from './types';
import { customPrompts } from '@/data/prompts/customPrompts';

export const prompts: Prompt[] = [...customPrompts, ...defaultPrompts];

export * from './types';
