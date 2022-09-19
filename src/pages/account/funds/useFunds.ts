/* eslint @typescript-eslint/no-explicit-any: "off" */
import { subgraph } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useCallback, useEffect, useReducer, useState } from "react";

import { Token } from "../../../components/convertion-rate/ConvertionRateContext";
import { CONFIG } from "../../../lib/config";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

type FundStatus = "idle" | "loading" | "error" | "success";

export interface FundsProps {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  allFunds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
  fundStatus: FundStatus;
}
export default function useFunds(
  accountId: string,
  tokens?: Token[] | null
): FundsProps {
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<subgraph.FundsEntityFieldsFragment>>(
    []
  );
  const [fundStatus, setFundStatus] = useState<FundStatus>("idle");

  const handleFunds = useCallback(
    (funds: Array<subgraph.FundsEntityFieldsFragment>) => {
      const mergeTokens: any[] = [
        ...funds,
        ...(tokens || []),
        ...(CONFIG.nativeCoin ? [CONFIG.nativeCoin] : [])
      ];

      const allTokens = mergeTokens?.reduce((acc, o) => {
        if (!acc.some((obj: any) => obj?.symbol === o?.symbol)) {
          acc.push(o);
        }
        return acc;
      }, []);

      const allTokensParsed =
        allTokens
          ?.map((token: any, index: number) =>
            token?.name
              ? {
                  accountId,
                  availableAmount: "0",
                  id: `${accountId}0x${String(index).padStart(2, "0")}`,
                  token: {
                    id: token?.address || ethers.constants.AddressZero,
                    address: token?.address || ethers.constants.AddressZero,
                    decimals: token?.decimals || "18",
                    name: token?.name,
                    symbol: token?.symbol
                  }
                }
              : null
          )
          .filter((n: boolean) => n !== null) || [];

      setFundStatus("success");
      setFunds(allTokensParsed);
    },
    [tokens, accountId]
  );

  const getFunds = useCallback(() => {
    if (accountId && coreSdk) {
      setFundStatus("loading");
      coreSdk
        .getFunds({
          fundsFilter: { accountId }
        })
        .then((funds) => {
          return handleFunds(funds);
        })
        .catch(() => {
          setFundStatus("error");
        });
    }
  }, [coreSdk, accountId, handleFunds]);

  useEffect(() => {
    getFunds();
  }, [getFunds, numRequests]);

  return { funds, allFunds: funds, reload, fundStatus };
}
