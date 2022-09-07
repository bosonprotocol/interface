/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { createContext } from "react";

import { getItemFromStorage } from "../../lib/utils/hooks/useLocalStorage";

export type Store = {
  type: string | null;
  rates: any;
  fixed: number;
  isLoading: boolean;
};

export interface ConvertionRateContextType {
  updateProps: (store: Store) => void;
  store: Store;
}

export const initalState: ConvertionRateContextType = {
  updateProps: () => {},
  store: {
    type: null,
    rates: getItemFromStorage("convertionRates", null),
    fixed: 2,
    isLoading: true
  } as const
};

const ConvertionRateContext = createContext(
  initalState as ConvertionRateContextType
);

export default ConvertionRateContext;
