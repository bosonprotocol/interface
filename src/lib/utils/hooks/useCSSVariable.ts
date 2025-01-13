import { useEffect, useState } from "react";

// all css variables can be found in src/components/app/index.tsx
export const useCSSVariable = (
  variableName:
    | "--headerBgColor"
    | "--headerTextColor"
    | "--primary"
    | "--secondary"
    | "--accent"
    | "--accentDark"
    | "--textColor"
    | "--primaryBgColor"
    | "--secondaryBgColor"
    | "--footerBgColor"
    | "--footerTextColor"
    | "--buttonBgColor"
    | "--buttonTextColor"
    | "--upperCardBgColor"
    | "--lowerCardBgColor"
) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    const computedCssVar = getComputedStyle(
      document.documentElement
    ).getPropertyValue(variableName);
    if (!computedCssVar) {
      console.error(`CSS variable ${variableName} is not defined`);
    }
    setValue(computedCssVar);
  }, [variableName]);
  return value;
};
