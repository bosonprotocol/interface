import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

export const ScrollToID = ({ id }: { id: string }) => {
  const localElement = document.getElementById(id);
  if (localElement) {
    localElement.scrollIntoView({ block: "center" });
  }
  return null;
};

export default ScrollToTop;
