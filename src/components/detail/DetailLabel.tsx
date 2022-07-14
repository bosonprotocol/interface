import { Offer } from "../../lib/types/offer";
import {
  getOfferLabel,
  OFFER_LABEL_TYPES
} from "../../lib/utils/getOfferLabel";
import { Label, Labels } from "./Detail.style";

interface Props {
  offer: Offer;
}

export default function DetailLabel({ offer }: Props) {
  const label = getOfferLabel(offer);
  if (label === false) {
    return null;
  }
  const type = OFFER_LABEL_TYPES[`${label as keyof typeof OFFER_LABEL_TYPES}`];

  return (
    <Labels data-testid="label">
      <Label
        $color={type.color}
        $background={type.background}
        data-testid={`${type.name.toLowerCase().replace(/_/g, "-")}-status`}
      >
        {type.name.replace(/_/g, " ")} {type.emoji}
      </Label>
    </Labels>
  );
}
