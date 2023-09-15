export function formatDelta(delta: number | null | undefined) {
  // Null-check not including zero
  if (
    delta === null ||
    delta === undefined ||
    delta === Infinity ||
    isNaN(delta)
  ) {
    return "-";
  }
  const formattedDelta = Math.abs(delta).toFixed(2) + "%";
  return formattedDelta;
}
