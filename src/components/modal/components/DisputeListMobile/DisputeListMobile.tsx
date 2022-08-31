import React from "react";

import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import DisputeListMobileElement from "./DisputeListMobileElement";

function DisputeListMobile({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <>
      {exchanges.map((exchange) => {
        return (
          <DisputeListMobileElement exchange={exchange} key={exchange.id} />
        );
      })}
    </>
  );
}

export default DisputeListMobile;
