import { ConfigId, envConfigs } from "@bosonprotocol/react-kit";
import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { getConnection } from "../../connection";
import { didUserReject } from "../../connection/utils";
import { isSupportedChain } from "../../constants/chains";
// import { useAppDispatch } from "state/hooks";
import { useSwitchChain } from "./useSwitchChain";

export default function useSelectChain() {
  const { setEnvConfig } = useConfigContext();
  // const dispatch = useAppDispatch();
  const { connector } = useWeb3React();
  const switchChain = useSwitchChain();
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    async (newConfigId: ConfigId) => {
      if (!connector) return;

      const connection = getConnection(connector);

      try {
        // const newConfig = getEnvConfigById(envName, newConfigId);
        // TODO: wrong envConfigs
        const newConfig = Object.values(envConfigs)
          .flat()
          .find((config) => config.configId === newConfigId);
        if (!newConfig) {
          return;
        }
        const targetChain = newConfig.chainId as ChainId;
        await switchChain(connector, targetChain);
        if (isSupportedChain(targetChain)) {
          searchParams.set("configId", newConfigId);
          setSearchParams(searchParams);

          setEnvConfig(newConfig);
        }
      } catch (error) {
        if (
          !didUserReject(connection, error) &&
          (error as any).code !== -32002 /* request already pending */
        ) {
          console.error("Failed to switch networks", error);
          // TODO: comment out?
          // dispatch(
          //   addPopup({
          //     content: {
          //       failedSwitchNetwork: targetChain,
          //       type: PopupType.FailedSwitchNetwork
          //     },
          //     key: "failed-network-switch"
          //   })
          // );
        }
      }
    },
    [
      connector,
      setEnvConfig,
      // TODO: comment out?
      // dispatch,
      searchParams,
      setSearchParams,
      switchChain
    ]
  );
}
