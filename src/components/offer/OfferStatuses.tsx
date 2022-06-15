import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getIsOfferExpired } from "../../lib/utils/getIsOfferExpired";

const Statuses = styled.div`
  display: flex;
  width: 100%;
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
  const isExpired = getIsOfferExpired(offer);
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
