import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";

const Statuses = styled.div`
  position: absolute;
  right: -1rem;
  top: 1rem;
  display: flex;
  gap: 2px;
  z-index: ${zIndex.OfferStatus};
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
  exchange: NonNullable<Offer["exchanges"]>[number];
}

const stateToComponent: {
  [x in exchanges.AllExchangeStates]: JSX.Element;
} = {
  [subgraph.ExchangeState.Cancelled]: (
    <Status
      $color={colors.white}
      $background={colors.red}
      className="status"
      data-testid="cancelled-status"
    >
      Cancelled
    </Status>
  ),
  [subgraph.ExchangeState.Revoked]: (
    <Status
      $color={colors.white}
      $background={colors.red}
      className="status"
      data-testid="revoked-status"
    >
      Revoked
    </Status>
  ),
  [subgraph.ExchangeState.Redeemed]: (
    <Status
      $color={colors.black}
      $background={colors.green}
      className="status"
      data-testid="redeemed-status"
    >
      Redeemed
    </Status>
  ),
  [subgraph.ExchangeState.Committed]: (
    <Status
      $color={colors.black}
      $background={colors.green}
      className="status"
      data-testid="committed-status"
    >
      Committed
    </Status>
  ),
  [subgraph.ExchangeState.Completed]: <></>,
  [exchanges.ExtendedExchangeState.Expired]: (
    <Status
      $color={colors.white}
      $background={colors.red}
      className="status"
      data-testid="expired-status"
    >
      Expired
    </Status>
  ),
  [exchanges.ExtendedExchangeState.NotRedeemableYet]: (
    <Status
      $color={colors.white}
      $background={colors.darkOrange}
      className="status"
      data-testid="not_redeemable_yet-status"
    >
      Not redeemable yet
    </Status>
  )
} as const;

export default function ExchangeStatuses({ offer, exchange }: Props) {
  const Component = exchange
    ? stateToComponent[
        exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
      ]
    : null;
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
