export type DeepReadonly<T> = {
  readonly // TODO: remove once https://github.com/microsoft/TypeScript/issues/13923 is merged
  [P in keyof T]: DeepReadonly<T[P]>;
};
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
