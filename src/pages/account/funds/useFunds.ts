import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useEffect, useReducer, useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

type FoundStatus = "idle" | "loading" | "error" | "success";

export default function useFunds(accountId: string): {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
  foundStatus: FoundStatus;
} {
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<subgraph.FundsEntityFieldsFragment>>(
    []
  );
  const [foundStatus, setFoundStatus] = useState<FoundStatus>("idle");

  const getFunds = useCallback(() => {
    if (accountId && coreSdk) {
      setFoundStatus("loading");
      coreSdk
        .getFunds({
          fundsFilter: { accountId }
        })
        .then((funds) => {
          setFoundStatus("success");
          return setFunds(funds);
        })
        .catch(() => {
          setFoundStatus("error");
        });
    }
  }, [coreSdk, accountId]);

  useEffect(() => {
    getFunds();
  }, [getFunds, numRequests]);

  return { funds, reload, foundStatus };
}
