import { useMediaQuery } from "react-responsive";

import { breakpointNumbers } from "../../../lib/styles/breakpoint";

export function useBreakpoints() {
  const isPhone = useMediaQuery({
    minWidth: breakpointNumbers.xxs,
    maxWidth: breakpointNumbers.s
  });
  const isTablet = useMediaQuery({
    minWidth: breakpointNumbers.s,
    maxWidth: breakpointNumbers.m
  });
  const isDesktop = useMediaQuery({ minWidth: breakpointNumbers.l });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });
  const isLandscapePhone = useMediaQuery({
    maxWidth: breakpointNumbers.m,
    maxHeight: breakpointNumbers.s
  });

  return {
    isPhone,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isLandscapePhone,
    isRetina
  };
}
