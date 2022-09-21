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

      const allTokensParsed =
        mergeTokens
          ?.map((token: any, index: number) =>
            token?.name || token.availableAmount
              ? {
                  accountId,
                  availableAmount: token?.availableAmount || "0",
                  id: `${accountId}0x${String(index).padStart(2, "0")}`,
                  name: token?.name || token?.token?.name,
                  token: {
                    id: token?.address || ethers.constants.AddressZero,
                    address: token?.address || ethers.constants.AddressZero,
                    decimals: token?.decimals || "18",
                    name: token?.name || token?.token?.name,
                    symbol: token?.symbol || token?.token?.symbol
                  }
                }
              : null
          )
          .reduce((acc: Array<any>, o: any) => {
            if (o !== null) {
              if (!acc.some((obj: any) => obj?.name === o?.name)) {
                acc.push(o);
              }
            }
            return acc;
          }, []) || [];

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
