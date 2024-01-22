import { ProductCardSkeleton } from "@bosonprotocol/react-kit";

import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { GridContainer } from "../../../ui/GridContainer";
import DisputeListMobileElement, {
  containerWidth
} from "./DisputeListMobileElement";

function DisputeListMobile({
  exchanges,
  isLoading
}: {
  exchanges: Exchange[];
  isLoading: boolean;
}) {
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
      {isLoading
        ? new Array(6).fill(0).map((_, index) => {
            return (
              <ProductCardSkeleton
                key={index}
                style={{ width: containerWidth }}
              />
            );
          })
        : exchanges.map((exchange) => {
            return (
              <DisputeListMobileElement exchange={exchange} key={exchange.id} />
            );
          })}
    </GridContainer>
  );
}

export default DisputeListMobile;
