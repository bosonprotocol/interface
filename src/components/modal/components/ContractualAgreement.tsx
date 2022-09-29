import { subgraph } from "@bosonprotocol/react-kit";

import ContractualAgreementComponent from "../../contractualAgreement/ContractualAgreement";
import Grid from "../../ui/Grid";

interface Props {
  offerId?: string;
  offerData?: subgraph.OfferFieldsFragment;
}

export default function ContractualAgreement({ offerId, offerData }: Props) {
  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <ContractualAgreementComponent
          offerId={offerId}
          offerData={offerData}
        ></ContractualAgreementComponent>
      </Grid>
    </>
  );
}
