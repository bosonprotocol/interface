import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const ScroolToID = ({ id }: { id: string }) => {
  useEffect(() => {
    const localElement = document.getElementById(id);
    if (localElement) {
      localElement.scrollIntoView({ block: "center" });
    }
  }, [id]);

  return null;
};

export default ScrollToTop;
