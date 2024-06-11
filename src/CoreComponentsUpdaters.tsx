import {
  CommitWidgetReduxUpdaters,
  ConfigProvider,
  hooks
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import {
  useAccount,
  useChainId,
  useProvider,
  useSigner
} from "lib/utils/hooks/connection/connection";
import React from "react";

export const CoreComponentsUpdaters: React.FC = () => {
  const provider = useProvider();
  const isWindowVisible = hooks.useIsWindowVisible();
  const { config } = useConfigContext();
  const connectedChainId = useChainId();
  const { account } = useAccount();
  const signer = useSigner();
  return (
    <ConfigProvider
      {...{
        ...CONFIG,
        envName: config.envName,
        configId: config.envConfig.configId,
        withWeb3React: false,
        withCustomReduxContext: false,
        defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
        defaultCurrencyTicker: CONFIG.defaultCurrency.ticker,
        licenseTemplate: CONFIG.rNFTLicenseTemplate,
        minimumDisputeResolutionPeriodDays: CONFIG.minimumDisputePeriodInDays,
        walletConnectProjectId: CONFIG.walletConnect.projectId,
        ipfsProjectId: CONFIG.infuraProjectId,
        ipfsProjectSecret: CONFIG.infuraProjectSecret,
        withExternalConnectionProps: true,
        externalConnectedChainId: connectedChainId,
        externalConnectedAccount: account,
        externalConnectedSigner: signer
      }}
    >
      <CommitWidgetReduxUpdaters
        isWindowVisible={isWindowVisible}
        provider={provider}
        withWeb3React={false}
      />
    </ConfigProvider>
  );
};
