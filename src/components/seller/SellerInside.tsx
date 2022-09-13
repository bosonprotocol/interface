import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
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
  if (props.sellerId === null) {
    return (
      <SellerWrapper label={label}>
        <Grid justifyContent="center" padding="5rem">
          <Typography tag="h5">
            You must be a seller to interact with this
          </Typography>
        </Grid>
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper label={label} {...rest}>
      {component(props)}
    </SellerWrapper>
  );
}

export default WithSellerData<SellerInsideProps>(SellerInside);
