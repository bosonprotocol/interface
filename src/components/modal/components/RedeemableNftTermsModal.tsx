import { subgraph } from "@bosonprotocol/react-kit";

import License from "../../license/License";

interface Props {
  offerData: subgraph.OfferFieldsFragment;
}

export function RedeemableNftTermsModal({ offerData }: Props) {
  return <License offerId={undefined} offerData={offerData}></License>;
}
