import {
  NEVER_RELOAD,
  useMainnetSingleCallResult
} from "lib/utils/hooks/multicall";
import { safeNamehash } from "lib/utils/safeNamehash";
import { useMemo } from "react";

import { isZero } from "../address";
import { useENSRegistrarContract, useENSResolverContract } from "./useContract";

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null): {
  loading: boolean;
  contenthash: string | null;
} {
  const ensNodeArgument = useMemo(
    () => [ensName ? safeNamehash(ensName) : undefined],
    [ensName]
  );
  const registrarContract = useENSRegistrarContract();
  const resolverAddressResult = useMainnetSingleCallResult(
    registrarContract,
    "resolver",
    ensNodeArgument,
    NEVER_RELOAD
  );
  const resolverAddress = resolverAddressResult.result?.[0];
  const resolverContract = useENSResolverContract(
    resolverAddress && isZero(resolverAddress) ? undefined : resolverAddress
  );
  const contenthash = useMainnetSingleCallResult(
    resolverContract,
    "contenthash",
    ensNodeArgument,
    NEVER_RELOAD
  );

  return useMemo(
    () => ({
      contenthash: contenthash.result?.[0] ?? null,
      loading: resolverAddressResult.loading || contenthash.loading
    }),
    [contenthash.loading, contenthash.result, resolverAddressResult.loading]
  );
}
