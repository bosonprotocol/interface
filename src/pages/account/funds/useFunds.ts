import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useEffect, useReducer, useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

export default function useFunds(accountId: string): {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
} {
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<subgraph.FundsEntityFieldsFragment>>(
    []
  );

  const getFunds = useCallback(() => {
    if (accountId && coreSdk) {
      coreSdk
        .getFunds({
          fundsFilter: { accountId }
        })
        .then((funds) => setFunds(funds));
    }
  }, [coreSdk, accountId]);

  useEffect(() => {
    getFunds();
  }, [getFunds, numRequests]);

  return { funds, reload };
}
