import { useCallSignerFromIframe } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { useAccount, useSigner } from "lib/utils/hooks/connection/connection";
import { useRef, useState } from "react";

import { WithSellerDataProps } from "../common/WithSellerData";
import { SellerInsideProps } from "../SellerInside";
declare const constants: {
  // comes from boson-widgets.js
  financeUrl: (widgetsHost: string, params: Record<string, unknown>) => string;
};
export default function SellerFinances({
  sellerId
}: SellerInsideProps & WithSellerDataProps) {
  const { config } = useConfigContext();
  const signer = useSigner();
  const { account = "" } = useAccount();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useCallSignerFromIframe({
    iframeRef,
    isIframeLoaded,
    signer,
    childIframeOrigin: CONFIG.widgetsUrl as `http${string}`
  });
  if (!constants) {
    return <p>There has been an error</p>;
  }

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: "100%",
        minHeight: "100%",
        border: "0"
      }}
      onLoad={() => {
        setIsIframeLoaded(true);
      }}
      src={`${constants.financeUrl(CONFIG.widgetsUrl, {
        sellerId,
        configId: config.envConfig.configId,
        account,
        parentOrigin: window.location.origin
      })}`}
    ></iframe>
  );
}
