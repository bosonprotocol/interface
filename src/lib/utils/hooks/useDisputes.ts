import { subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { useCoreSDK } from "../useCoreSdk";

export function useDisputes(
  props: subgraph.GetDisputesQueryQueryVariables,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();
  return useQuery(
    ["disputes", props],
    async () => {
      const disputes = await coreSDK.getDisputes(props);

      return disputes;
    },
    {
      ...options
    }
  );
}
