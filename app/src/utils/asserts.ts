import { Nullable } from '@/types';

export function assertNonNullable<T>(
  value: Nullable<T>,
): asserts value is NonNullable<T> {
  if (value == null) throw new Error(`Value is not defined: ${value}`);
}

export function assertIsDefined<T>(value: Nullable<T>): NonNullable<T> {
  assertNonNullable(value);
  return value;
}
