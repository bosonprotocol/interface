export type DeepReadonly<T> = {
  readonly // TODO: remove once https://github.com/microsoft/TypeScript/issues/13923 is merged
  [P in keyof T]: DeepReadonly<T[P]>;
};
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type Falsy = false | 0 | "" | null | undefined;

export const isTruthy = <T>(x: T | Falsy): x is T => !!x;
