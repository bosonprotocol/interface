import { ForwardedRef, forwardRef } from "react";

import { zIndex } from "../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../lib/utils/hooks/useBreakpoints";
// import * as styles from "./NavDropdown.css";

const stylesDesktopNavDropdown = {
  position: "absolute",
  borderRadius: "12px",
  top: "41px",
  borderStyle: "solid",
  borderColor: "#E8ECFB",
  borderWidth: "1px",
  boxShadow: "0px 4px 12px 0px #00000026"
} as const;

const stylesMobileNavDropdown = {
  position: "fixed",
  borderTopRightRadius: "12",
  borderTopLeftRadius: "12",
  inset: "0",
  width: "full",
  borderRightWidth: "0px",
  borderLeftWidth: "0px"
} as const;

export const NavDropdown = forwardRef(
  (props: Record<string, any>, ref: ForwardedRef<HTMLDivElement>) => {
    const { isLteS: isMobile } = useBreakpoints();
    return (
      <div
        ref={ref}
        data-testid="nav-dropdown"
        style={{
          zIndex: zIndex.Modal,

          left: props.left,
          right: props.right,
          background: "white",

          paddingBottom: "8",
          paddingTop: "8",
          ...(isMobile ? stylesMobileNavDropdown : stylesDesktopNavDropdown)
        }}
      >
        {props.children}
      </div>
    );
  }
);

NavDropdown.displayName = "NavDropdown";
