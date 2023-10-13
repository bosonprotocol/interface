import { memo } from "react";

import SellerID from "../../../../components/ui/SellerID";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { BuyerOrSeller } from "../../types";

export const SellerComponent = memo(
  ({
    size,
    withProfileText,
    exchange,
    buyerOrSeller
  }: {
    size: number;
    withProfileText?: boolean;
    exchange: Exchange | undefined;
    buyerOrSeller: BuyerOrSeller;
  }) => {
    if (!exchange) {
      return null;
    }
    return (
      <SellerID
        offer={exchange?.offer}
        buyerOrSeller={buyerOrSeller}
        withProfileImage
        accountImageSize={size}
        withProfileText={withProfileText}
      />
    );
  }
);
