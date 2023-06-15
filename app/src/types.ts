export type Nullable<T> = T | null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
