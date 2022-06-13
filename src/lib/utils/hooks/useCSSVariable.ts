export const useCSSVariable = (variableName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  );
};
