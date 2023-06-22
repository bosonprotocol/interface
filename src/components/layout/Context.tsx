import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const LayoutContext = createContext<{
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
}>({
  fullWidth: false,
  setFullWidth: () => null
});

export const useLayoutContext = () => useContext(LayoutContext);
