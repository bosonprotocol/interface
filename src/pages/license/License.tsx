import { useParams } from "react-router-dom";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/customNavigation/LinkWithQuery";
import LicenseComponent from "../../components/license/License";
import Typography from "../../components/ui/Typography";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import useOfferByUuid from "../../lib/utils/hooks/product/useOfferByUuid";

const Container = styled.div`
  display: block;
  overflow: auto;
`;

export default function License() {
  const { [UrlParameters.uuid]: uuid } = useParams();
  // Note: ideally the license is referring to the tNFT token; However, the
  //  token only exists after a commit and the token metadata are built just
  //  before the offer creation. So, here we are referring to an offer
  //  identified by its uuid (offerId is not even known before the offer is
  //  created)

  const { offerId } = useOfferByUuid(uuid);

  if (!offerId) {
    return <div data-testid="notFound">This offer does not exist</div>;
  }

  return (
    <>
      <Container>
        <LicenseComponent
          offerId={offerId}
          offerData={undefined}
        ></LicenseComponent>
      </Container>
      <Typography tag="p">
        Click&nbsp;
        <LinkWithQuery
          to={BosonRoutes.ContractualAgreement.replace(
            `:${UrlParameters.offerId}`,
            offerId
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {"here"}
        </LinkWithQuery>
        &nbsp;{"to read the Buyer & Seller Agreement"}
      </Typography>
    </>
  );
}
