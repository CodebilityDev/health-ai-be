export type PrintTypes<T> = {
  [K in keyof T]: T[K];
};
