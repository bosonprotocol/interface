import { memo } from "react";

import SellerID from "../../../../components/ui/SellerID";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { BuyerOrSeller } from "../../types";

export const SellerComponent = memo(
  ({
    size,
    withProfileText,
    exchange,
    buyerOrSeller,
    lensProfile
  }: {
    size: number;
    withProfileText?: boolean;
    exchange: Exchange | undefined;
    buyerOrSeller: BuyerOrSeller;
    lensProfile?: Profile;
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
        lensProfile={lensProfile}
      />
    );
  }
);
