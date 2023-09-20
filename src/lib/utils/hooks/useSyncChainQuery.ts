import { ConfigId } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import { configQueryParameters } from "lib/routing/parameters";
import { ParsedQs } from "qs";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { isSupportedChain } from "../../constants/chains";
import { useAccount } from "./ethers/connection";
import useParsedQueryString from "./useParsedQueryString";
import useSelectChain from "./useSelectChain";

function getParsedConfigId(parsedQs?: ParsedQs) {
  const configId = parsedQs?.configId;
  if (!configId || typeof configId !== "string") return;

  return configId;
}

export default function useSyncChainQuery() {
  const { chainId, isActive } = useWeb3React();
  const { account } = useAccount();
  const { config } = useConfigContext();
  const currentConfigId = config.envConfig.configId;

  const parsedQs = useParsedQueryString();
  const configIdRef = useRef(currentConfigId);
  const accountRef = useRef(account);

  useEffect(() => {
    if (account && account !== accountRef.current) {
      configIdRef.current = currentConfigId;
      accountRef.current = account;
    }
  }, [account, currentConfigId]);

  const urlConfigId = getParsedConfigId(parsedQs);

  const selectChain = useSelectChain({ doConnect: true, throwErrors: false });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // if the connected chainId does not match the query param configId, change the user's chain on pageload
    if (
      isActive &&
      urlConfigId &&
      configIdRef.current === currentConfigId &&
      currentConfigId !== urlConfigId
    ) {
      selectChain(urlConfigId as ConfigId);
    }
    // If a user has a connected wallet and has manually changed their chain, update the query parameter if it's supported
    else if (
      account &&
      configIdRef.current !== currentConfigId &&
      currentConfigId !== urlConfigId
    ) {
      if (isSupportedChain(chainId)) {
        searchParams.set(configQueryParameters.configId, currentConfigId);
      } else {
        searchParams.delete(configQueryParameters.configId);
      }
      setSearchParams(searchParams);
    }
    // If a user has a connected wallet and the currentConfigId matches the query param chain, update the configIdRef
    else if (isActive && currentConfigId === urlConfigId) {
      configIdRef.current = urlConfigId;
    }
  }, [
    currentConfigId,
    urlConfigId,
    selectChain,
    searchParams,
    isActive,
    chainId,
    account,
    setSearchParams
  ]);
}
