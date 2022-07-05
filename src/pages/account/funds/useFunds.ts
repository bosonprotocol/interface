import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useCallback, useEffect, useReducer, useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

export default function useFunds(accountId: string): {
  funds: Array<FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
} {
  const coreSdk = useCoreSDK();
  const [numRequests, reload] = useReducer((state) => state + 1, 0);
  const [funds, setFunds] = useState<Array<FundsEntityFieldsFragment>>([]);

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
