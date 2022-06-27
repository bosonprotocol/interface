import { useMediaQuery } from "react-responsive";

import { breakpointNumbers } from "../../../lib/styles/breakpoint";

export function useBreakpoints() {
  const isXXS = useMediaQuery({
    minWidth: breakpointNumbers.xxs,
    maxWidth: breakpointNumbers.xs
  });
  const isXS = useMediaQuery({
    minWidth: breakpointNumbers.xs,
    maxWidth: breakpointNumbers.s
  });
  const isS = useMediaQuery({
    minWidth: breakpointNumbers.s,
    maxWidth: breakpointNumbers.m
  });
  const isM = useMediaQuery({
    minWidth: breakpointNumbers.m,
    maxWidth: breakpointNumbers.l
  });
  const isL = useMediaQuery({
    minWidth: breakpointNumbers.l,
    maxWidth: breakpointNumbers.xl
  });
  const isXL = useMediaQuery({
    minWidth: breakpointNumbers.xl
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isLteXS = isXXS || isXS;
  const isLteS = isLteXS || isS;
  const isLteM = isLteS || isM;
  const isLteL = isLteM || isL;
  const isLteXL = isLteL || isXL;
  return {
    isXXS,
    isXS,
    isS,
    isM,
    isL,
    isXL,
    isLteXS,
    isLteS,
    isLteM,
    isLteL,
    isLteXL,
    isPortrait,
    isLandscape
  };
}
