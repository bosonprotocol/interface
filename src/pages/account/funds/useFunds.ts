import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useEffect, useReducer, useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

type FundStatus = "idle" | "loading" | "error" | "success";

export default function useFunds(accountId: string): {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
  fundStatus: FundStatus;
} {
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<subgraph.FundsEntityFieldsFragment>>(
    []
  );
  const [fundStatus, setFundStatus] = useState<FundStatus>("idle");

  const getFunds = useCallback(() => {
    if (accountId && coreSdk) {
      setFundStatus("loading");
      coreSdk
        .getFunds({
          fundsFilter: { accountId }
        })
        .then((funds) => {
          setFundStatus("success");
          return setFunds(funds);
        })
        .catch(() => {
          setFundStatus("error");
        });
    }
  }, [coreSdk, accountId]);

  useEffect(() => {
    getFunds();
  }, [getFunds, numRequests]);

  return { funds, reload, fundStatus };
}
