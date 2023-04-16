import { Nullable } from '@/types';

export const assertIsDefined = <T>(value: Nullable<T>): T => {
  if (value == null) throw new Error(`Value is not defined: ${value}`);

  return value;
};
