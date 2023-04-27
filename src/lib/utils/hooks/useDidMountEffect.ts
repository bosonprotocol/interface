import { useEffect, useRef } from "react";

type Params = Parameters<typeof useEffect>;

// to have a 'useEffect' that only changes when dependencies change (instead of that + initial render)
export const useDidMountEffect = (func: Params[0], deps: Params[1]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
