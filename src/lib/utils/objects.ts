export function removeEmpty<T extends Record<string, unknown>>(obj: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
