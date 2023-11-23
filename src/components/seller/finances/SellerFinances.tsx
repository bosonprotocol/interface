import { useCallSignerFromIframe } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { useAccount, useSigner } from "lib/utils/hooks/connection/connection";
import { useRef, useState } from "react";

import { WithSellerDataProps } from "../common/WithSellerData";
import { SellerInsideProps } from "../SellerInside";

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
    childIframeOrigin: CONFIG.widgetsUrl as `http:${string}`
  });
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
      id="bosonModal"
      src={`${CONFIG.widgetsUrl}/#/finance?sellerId=${sellerId}&configId=${config.envConfig.configId}&account=${account}`}
    ></iframe>
  );
}
