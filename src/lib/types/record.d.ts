export type RecordWithSameKeyAndValue<T extends Record<string, unknown>> = {
  [K in keyof T]: K;
};
