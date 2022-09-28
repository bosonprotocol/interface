import { useParams } from "react-router-dom";
import styled from "styled-components";

import ContractualAgreementComponent from "../../components/contractualAgreement/ContractualAgreement";
import Loading from "../../components/ui/Loading";
import { UrlParameters } from "../../lib/routing/parameters";
import useOffer from "../../lib/utils/hooks/offer/useOffer";

const Container = styled.div`
  display: block;
  overflow: auto;
`;

export default function ContractualAgreement() {
  const { [UrlParameters.offerId]: offerId } = useParams();

  const {
    data: offer,
    isError,
    isLoading
  } = useOffer(
    {
      offerId: offerId || ""
    },
    { enabled: !!offerId }
  );

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
        <ContractualAgreementComponent
          offerId={offer.id}
        ></ContractualAgreementComponent>
      </Container>
    </>
  );
}
