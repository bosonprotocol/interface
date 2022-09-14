import { ReactElement } from "react";

import { Offer } from "../../lib/types/offer";
import { Action } from "../offer/OfferCard";
import ProductCard from "../productCard/ProductCard";
import Grid from "../ui/Grid";
import GridContainer, { ItemsPerRow } from "../ui/GridContainer";
import Typography from "../ui/Typography";

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading?: boolean;
  loadingComponent?: ReactElement;
  showSeller?: boolean;
  action: Action;
  showInvalidOffers: boolean;
  isPrivateProfile?: boolean;
  type?: "gone" | "hot" | "soon" | undefined;
  itemsPerRow?: Partial<ItemsPerRow>;
}

export default function OfferList({
  offers,
  isLoading,
  isError,
  loadingComponent,
  showInvalidOffers,
  itemsPerRow
}: Props) {
  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (isError) {
    return (
      <Grid data-testid="errorOffers">
        <Typography tag="h3">
          There has been an error, please try again later...
        </Typography>
      </Grid>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Grid data-testid="noOffers">
        <Typography tag="h3">No products found</Typography>
      </Grid>
    );
  }

  return (
    <GridContainer itemsPerRow={itemsPerRow}>
      {offers.map((offer: Offer) => {
        return (
          (offer.isValid || (showInvalidOffers && !offer.isValid)) && (
            <ProductCard key={offer.id} offer={offer} dataTestId="offer" />
          )
        );
      })}
    </GridContainer>
  );
}
