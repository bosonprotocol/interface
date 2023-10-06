import { ConfigId } from "@bosonprotocol/react-kit";
import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import ErrorToast from "components/toasts/common/ErrorToast";
import Typography from "components/ui/Typography";
import { envConfigsFilteredByEnv } from "lib/config";
import { configQueryParameters } from "lib/routing/parameters";
import { colors } from "lib/styles/colors";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { getConnection } from "../../connection";
import { didUserReject } from "../../connection/utils";
import { isSupportedChain } from "../../constants/chains";
import { useIsMagicLoggedIn } from "./magic";
import { useSwitchChain } from "./useSwitchChain";

export default function useSelectChain(
  { throwErrors, doConnect }: { throwErrors: boolean; doConnect: boolean } = {
    throwErrors: false,
    doConnect: false
  }
) {
  const { setEnvConfig } = useConfigContext();
  const { connector } = useWeb3React();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const switchChain = useSwitchChain(doConnect);
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    async (newConfigId: ConfigId | undefined) => {
      if (!newConfigId) return;
      if (!connector) return;

      const connection = getConnection(connector);

      try {
        const newConfig = envConfigsFilteredByEnv.find(
          (config) => config.configId === newConfigId
        );
        if (!newConfig) {
          return;
        }
        const targetChain = newConfig.chainId as ChainId;
        if (!isMagicLoggedIn) {
          await switchChain(connector, targetChain);
        }
        if (isSupportedChain(targetChain)) {
          searchParams.set(configQueryParameters.configId, newConfigId);
          setSearchParams(searchParams);
          console.log("newConfig", newConfig);
          setEnvConfig(newConfig);
        }
      } catch (error) {
        if (
          !didUserReject(connection, error) &&
          (error as { code: number }).code !==
            -32002 /* request already pending */
        ) {
          console.error("Failed to switch networks", error);
          toast((t) => (
            <ErrorToast t={t}>
              <Typography tag="p" color={colors.red}>
                Failed to switch networks. Try switching the network in your
                wallet's settings.
              </Typography>
            </ErrorToast>
          ));
        }
        if (throwErrors) {
          throw error;
        }
      }
    },
    [
      connector,
      setEnvConfig,
      searchParams,
      setSearchParams,
      switchChain,
      throwErrors,
      isMagicLoggedIn
    ]
  );
}
