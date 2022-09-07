import { useContext } from "react";

import ConvertionRateContext from "./ConvertionRateContext";

export function useConvertionRate() {
  const context = useContext(ConvertionRateContext);

  return {
    ...context
  };
}
