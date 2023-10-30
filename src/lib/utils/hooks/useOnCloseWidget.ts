import { CONFIG } from "lib/config";
import { useEffect } from "react";

export const useOnCloseWidget = (callback: (() => unknown) | undefined) => {
  useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      if (
        event.origin === CONFIG.widgetsUrl &&
        event.data ===
          ("constants" in window &&
          typeof window.constants === "object" &&
          window.constants &&
          "hideModalMessage" in window.constants
            ? window.constants.hideModalMessage
            : "boson-close-iframe")
      ) {
        callback?.();
      }
    }
    window.addEventListener("message", onMessageReceived);
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [callback]);
};
