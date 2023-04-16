export type Nullable<T> = T | null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;
