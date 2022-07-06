import { offers } from "@bosonprotocol/core-sdk";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";

const Statuses = styled.div`
  display: flex;
  gap: 2px;
`;

const Status = styled.div<{ $background: string; $color: string }>`
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};
  padding: 0.5rem 1rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
`;

interface Props {
  offer: Offer;
}

const statusToComponent = {
  [offers.OfferState.EXPIRED]: (
    <Status
      $color={colors.white}
      $background={colors.red}
      className="status"
      data-testid="expired-status"
    >
      Expired
    </Status>
  ),
  [offers.OfferState.VOIDED]: (
    <Status
      $color={colors.white}
      $background={colors.red}
      className="status"
      data-testid="voided-status"
    >
      Voided
    </Status>
  ),
  [offers.OfferState.NOT_YET_VALID]: (
    <Status
      $color={colors.white}
      $background={colors.darkOrange}
      className="status"
      data-testid="not_yet_valid-status"
    >
      Not yet valid
    </Status>
  ),
  [offers.OfferState.VALID]: <></>
} as const;

export default function OfferStatuses({ offer }: Props) {
  const status = offers.getOfferStatus(offer);
  const Component = statusToComponent[status];
  const isMetadataValid = offer.isValid;

  return (
    <Statuses data-testid="statuses">
      {Component && Component}
      {!isMetadataValid && (
        <Status
          $color={colors.white}
          $background={colors.black}
          className="status"
          data-testid="unsupported-status"
        >
          Unsupported
        </Status>
      )}
    </Statuses>
  );
}
