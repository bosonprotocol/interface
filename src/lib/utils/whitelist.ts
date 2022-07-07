export function parseWhitelist(value?: string): string[] | undefined {
  if (value) {
    return value.split(",");
  }

  return undefined;
}
