import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useCallback, useEffect, useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

export default function useFunds(): Array<FundsEntityFieldsFragment> {
  const coreSdk = useCoreSDK();
  const [funds, setFunds] = useState<Array<FundsEntityFieldsFragment>>([]);

  const getFunds = useCallback(() => {
    coreSdk.getFunds().then((funds) => setFunds(funds));
  }, [coreSdk]);

  useEffect(() => {
    getFunds();
  }, [getFunds, coreSdk]);

  return funds;
}
