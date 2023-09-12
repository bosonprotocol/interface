import { useEffect } from "react";

import { useBreakpoints } from "./useBreakpoints";

/** Disables scrolling of the main body on mobile when `true` is passed. Generally used for modals. */
export default function useDisableScrolling(
  disable: boolean | undefined | null
) {
  const { isLteS } = useBreakpoints();
  const isMobile = isLteS;
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = disable ? "hidden" : "auto";
  }, [disable, isMobile]);
}
