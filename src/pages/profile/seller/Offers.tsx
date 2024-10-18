import { useMemo } from "react";

import OfferList from "../../../components/offers/OfferList";
import { Profile } from "../../../lib/utils/hooks/lens/graphql/generated";
import { ExtendedSeller } from "../../explore/WithAllOffers";
import { Action } from "./const";

interface Props {
  products: ExtendedSeller;
  seller: {
    sellerId: string;
    lensProfile?: Profile;
  };
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
  isLoading,
  seller
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
      seller={seller}
    />
  );
}
