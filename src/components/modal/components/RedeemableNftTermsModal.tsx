import { subgraph } from "@bosonprotocol/react-kit";

import License from "../../license/License";

type Props =
  | {
      offerData: subgraph.OfferFieldsFragment;
      offerId: undefined;
    }
  | {
      offerData: undefined;
      offerId: subgraph.OfferFieldsFragment["id"];
    };

export function RedeemableNftTermsModal({ offerData, offerId }: Props) {
  return <License offerId={offerId} offerData={offerData}></License>;
}
