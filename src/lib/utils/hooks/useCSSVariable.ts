import { useEffect, useState } from "react";

// all css variables can be found in src/components/app/index.tsx
export const useCSSVariable = (
  variableName: "--primary" | "--secondary" | "--accent" | "--accentDark"
) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setValue(
      getComputedStyle(document.documentElement).getPropertyValue(variableName)
    );
  }, [variableName]);
  return value;
};
