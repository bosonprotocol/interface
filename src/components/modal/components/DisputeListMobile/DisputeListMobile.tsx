import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import GridContainer from "../../../ui/GridContainer";
import DisputeListMobileElement from "./DisputeListMobileElement";

function DisputeListMobile({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 2,
        l: 2,
        xl: 2
      }}
      style={{ placeItems: "center" }}
    >
      {exchanges.map((exchange) => {
        return (
          <DisputeListMobileElement exchange={exchange} key={exchange.id} />
        );
      })}
    </GridContainer>
  );
}

export default DisputeListMobile;
