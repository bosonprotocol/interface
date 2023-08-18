import { ForwardedRef, forwardRef } from "react";

import { zIndex } from "../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../lib/utils/hooks/useBreakpoints";
// import * as styles from "./NavDropdown.css";

export const NavDropdown = forwardRef(
  (props: Record<string, any>, ref: ForwardedRef<HTMLDivElement>) => {
    const { isXS: isMobile } = useBreakpoints();
    return (
      <div
        ref={ref}
        data-testid="nav-dropdown"
        style={{
          zIndex: zIndex.Modal,
          top: "56px",
          left: props.left,
          right: props.right,
          background: "white", // backgroundSurface
          borderStyle: "solid",
          borderColor: "backgroundOutline",
          borderWidth: "1px",
          paddingBottom: "8",
          paddingTop: "8",
          position: "absolute",
          borderRadius: "12",
          boxShadow: "0px 4px 12px 0px #00000026"
        }}
        // className={isMobile ? styles.mobileNavDropdown : styles.NavDropdown}
      >
        {props.children}
      </div>
    );
  }
);

NavDropdown.displayName = "NavDropdown";
