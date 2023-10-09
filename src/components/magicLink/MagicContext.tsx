import { InnerMagicProvider } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { ReactNode } from "react";

export const MagicProvider = ({ children }: { children: ReactNode }) => {
  const { config } = useConfigContext();
  const chainId = config.envConfig.chainId;
  return (
    <InnerMagicProvider
      chainId={chainId}
      magicLinkKey={CONFIG.magicLinkKey}
      rpcUrls={CONFIG.rpcUrls}
    >
      {children}
    </InnerMagicProvider>
  );
};
