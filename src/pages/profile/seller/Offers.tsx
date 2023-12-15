import { useMemo } from "react";

import { Action } from "../../../components/offer/OfferCard";
import OfferList from "../../../components/offers/OfferList";
import { ExtendedSeller } from "../../explore/WithAllOffers";

interface Props {
  products: ExtendedSeller;
  sellerId: string;
  action: Action;
  showInvalidOffers: boolean;
  isPrivateProfile: boolean;
  isLoading: boolean;
}

export default function Offers({
  products,
  action,
  showInvalidOffers,
  isPrivateProfile,
  isLoading
}: Props) {
  const allOffers = useMemo(() => {
    return products?.offers || [];
  }, [products]);

  return (
    <OfferList
      isLoading={isLoading}
      numOffers={12}
      offers={allOffers}
      isError={false}
      showSeller={false}
      action={action}
      showInvalidOffers={showInvalidOffers}
      isPrivateProfile={isPrivateProfile}
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    />
  );
}
