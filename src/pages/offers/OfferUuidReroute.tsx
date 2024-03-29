import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { useParams } from "react-router-dom";

import Navigate from "../../components/customNavigation/Navigate";
import { UrlParameters } from "../../lib/routing/parameters";
import { OffersRoutes } from "../../lib/routing/routes";
import useOfferByUuid from "../../lib/utils/hooks/product/useOfferByUuid";

export default function OfferUuidReroute() {
  const { [UrlParameters.uuid]: uuid, [UrlParameters.sellerId]: sellerId } =
    useParams();

  const { offerId } = useOfferByUuid(uuid, sellerId);

  if (!offerId) {
    return (
      <EmptyErrorMessage
        title="Not found"
        message="This offer does not exist"
      />
    );
  }

  return (
    <Navigate
      to={{
        pathname: OffersRoutes.OfferDetail.replace(
          `:${UrlParameters.offerId}`,
          offerId
        )
      }}
    ></Navigate>
  );
}
