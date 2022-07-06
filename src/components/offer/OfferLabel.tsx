import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import {
  getOfferLabel,
  OFFER_LABEL_TYPES
} from "../../lib/utils/getOfferLabel";

const Labels = styled.div`
  display: flex;
  margin-left: 1rem;
`;

const Label = styled.div<{ $background: string; $color: string }>`
  background: ${(props) => props.$background || colors.lightGrey};
  color: ${(props) => props.$color || colors.darkGrey};
  padding: 0.5rem 1rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`;

interface Props {
  offer: Offer;
}

export default function OfferLabel({ offer }: Props) {
  const label = getOfferLabel(offer);
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
