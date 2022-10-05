import { useParams } from "react-router-dom";

import Navigate from "../../components/customNavigation/Navigate";
import { UrlParameters } from "../../lib/routing/parameters";
import { OffersRoutes } from "../../lib/routing/routes";
import useOfferByUuid from "../../lib/utils/hooks/product/useOfferByUuid";

export default function OfferUuidReroute() {
  const { [UrlParameters.uuid]: uuid } = useParams();

  const result = useOfferByUuid(uuid);
  const { offerId } = result;

  if (!offerId) {
    return <div data-testid="notFound">This offer does not exist</div>;
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
