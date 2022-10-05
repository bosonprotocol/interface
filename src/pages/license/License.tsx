import { useParams } from "react-router-dom";
import styled from "styled-components";

import LicenseComponent from "../../components/license/License";
import Loading from "../../components/ui/Loading";
import { UrlParameters } from "../../lib/routing/parameters";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

const Container = styled.div`
  display: block;
  overflow: auto;
`;

export default function License() {
  const { [UrlParameters.tokenId]: tokenId } = useParams();
  // The license is referring to a token (rNFT) identified by a tokenId (NFT convention)
  // By convention, Boson Protocol uses the exchangeId as tokenId
  const exchangeId = tokenId;
  const {
    data: exchanges,
    isError,
    isLoading
  } = useExchanges(
    {
      id: exchangeId,
      disputed: null
    },
    {
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

  if (!exchangeId) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div data-testid="errorExchange">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offer) {
    return <div data-testid="notFound">This exchange does not exist</div>;
  }

  if (!offer.isValid) {
    return (
      <div data-testid="invalidMetadata">
        This offer does not match the expected metadata standard this
        application enforces
      </div>
    );
  }

  return (
    <>
      <Container>
        <LicenseComponent
          offerId={offer.id}
          offerData={undefined}
        ></LicenseComponent>
      </Container>
    </>
  );
}
