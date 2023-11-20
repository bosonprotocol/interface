import ContractualAgreementComponent from "components/contractualAgreement/ContractualAgreement";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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
      <EmptyErrorMessage
        title="Error"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (!offer) {
    return (
      <EmptyErrorMessage
        title="Not found"
        message="This offer does not exist"
      />
    );
  }

  if (!offer.isValid) {
    return (
      <EmptyErrorMessage
        title="Invalid offer"
        message="This offer does not match the expected metadata standard this application enforces"
      />
    );
  }

  return (
    <Container>
      <ContractualAgreementComponent
        offerId={offer.id}
        offerData={undefined}
      ></ContractualAgreementComponent>
    </Container>
  );
}
