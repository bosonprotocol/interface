import { offers } from "@bosonprotocol/core-sdk";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";

const Statuses = styled.div`
  display: flex;
  gap: 2px;
`;

const Status = styled.div<{ $color: string }>`
  background: ${(props) => props.$color};
  padding: 2px 10px;
  border-radius: 50px;
  font-weight: 800;
`;

interface Props {
  offer: Offer;
}

export default function OfferStatuses({ offer }: Props) {
  const status = offers.getOfferStatus(offer);
  const isExpired = status === offers.OfferState.EXPIRED;
  const isMetadataValid = offer.isValid;

  return (
    <Statuses data-testid="statuses">
      {!isMetadataValid && (
        <Status
          $color={colors.red}
          className="status"
          data-testid="invalid-status"
        >
          Invalid
        </Status>
      )}
      {isExpired && (
        <Status
          $color={colors.orange}
          className="status"
          data-testid="expired-status"
        >
          Expired
        </Status>
      )}
    </Statuses>
  );
}
