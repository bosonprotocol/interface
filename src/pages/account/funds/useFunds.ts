/* eslint @typescript-eslint/no-explicit-any: "off" */
import { subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { ethers } from "ethers";
import { useCallback, useEffect, useReducer, useState } from "react";

import { Token } from "../../../components/convertion-rate/ConvertionRateContext";
import { ProgressStatus } from "../../../lib/types/progressStatus";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

export interface FundsProps {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
  fundStatus: ProgressStatus;
}
export default function useFunds(
  accountId: string,
  tokens?: Token[] | null
): FundsProps {
  const { config } = useConfigContext();
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<subgraph.FundsEntityFieldsFragment>>(
    []
  );
  const [fundStatus, setFundStatus] = useState<ProgressStatus>(
    ProgressStatus.IDLE
  );
  const nativeCoin = config.envConfig.nativeCoin;
  const handleFunds = useCallback(
    (funds: Array<subgraph.FundsEntityFieldsFragment>) => {
      const mergeTokens: any[] = [
        ...funds,
        ...(tokens || []),
        ...(nativeCoin ? [nativeCoin] : [])
      ];

      const allTokensParsed =
        mergeTokens
          ?.map((token: any, index: number) =>
            token?.name || token.availableAmount
              ? {
                  accountId,
                  availableAmount: token?.availableAmount || "0",
                  id: `${accountId}0x${String(index).padStart(2, "0")}`,
                  token: {
                    id:
                      token?.token?.id ||
                      token?.address ||
                      ethers.constants.AddressZero,
                    address:
                      token?.token?.address ||
                      token?.address ||
                      ethers.constants.AddressZero,
                    decimals: token?.token?.decimals || token?.decimals || "18",
                    name: token?.token?.name || token?.name,
                    symbol: token?.token?.symbol || token?.symbol
                  }
                }
              : null
          )
          .reduce((acc: Array<any>, o: any) => {
            if (o !== null) {
              if (
                !acc.some((obj: any) => obj?.token?.symbol === o?.token?.symbol)
              ) {
                acc.push(o);
              }
            }
            return acc;
          }, []) || [];
      setFundStatus(ProgressStatus.SUCCESS);
      setFunds(allTokensParsed);
    },
    [tokens, accountId, nativeCoin]
  );

  const getFunds = useCallback(() => {
    if (accountId && coreSdk) {
      setFundStatus(ProgressStatus.LOADING);
      coreSdk
        .getFunds({
          fundsFilter: { accountId }
        })
        .then((funds) => handleFunds(funds))
        .catch(() => {
          setFundStatus(ProgressStatus.ERROR);
        });
    }
  }, [coreSdk, accountId, handleFunds]);

  useEffect(() => {
    getFunds();
  }, [getFunds, numRequests]);

  return { funds, reload, fundStatus };
}
