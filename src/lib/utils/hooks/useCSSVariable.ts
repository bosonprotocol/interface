import { useEffect, useState } from "react";

// all css variables can be found in src/components/app/index.tsx
export const useCSSVariable = (
  variableName:
    | "--headerBgColor"
    | "--headerTextColor"
    | "--primary"
    | "--secondary"
    | "--accent"
    | "--accentNoDefault"
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
    setValue(
      getComputedStyle(document.documentElement).getPropertyValue(variableName)
    );
  }, [variableName]);
  return value;
};
