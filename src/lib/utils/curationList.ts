export function parseCurationList(value?: string): string[] | undefined {
  if (value) {
    return value.split(",");
  }

  return undefined;
}
