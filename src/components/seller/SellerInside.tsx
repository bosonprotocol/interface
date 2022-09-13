import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import { WithSellerData, WithSellerDataProps } from "./common/WithSellerData";
import { sellerPageTypes } from "./SellerPages";
import SellerWrapper from "./SellerWrapper";

export interface SellerInsideProps {
  sellerId: string;
}
function SellerInside(props: SellerInsideProps & WithSellerDataProps) {
  const { [UrlParameters.sellerPage]: sellerPage } = useParams();
  const { label, component, ...rest } = useMemo(
    () =>
      sellerPageTypes[sellerPage as keyof typeof sellerPageTypes] ||
      sellerPageTypes.dashboard,
    [sellerPage]
  );

  return (
    <SellerWrapper label={label} {...rest}>
      {component(props)}
    </SellerWrapper>
  );
}

export default WithSellerData<SellerInsideProps>(SellerInside);
