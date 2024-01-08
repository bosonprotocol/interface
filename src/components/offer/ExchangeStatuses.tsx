import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { defaultFontFamily } from "lib/styles/fonts";
import { useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { useDisputeSubStatusInfo } from "../../lib/utils/hooks/useDisputeSubStatusInfo";
import { Exchange } from "../../lib/utils/hooks/useExchanges";

const Statuses = styled.div`
  position: absolute;
  right: -1rem;
  top: 1rem;
  display: flex;
  gap: 2px;
  z-index: ${zIndex.OfferStatus};
  &[data-dot="true"] {
    > div {
      &:after {
        opacity: 0.2;
      }
      &[data-testid="voided-status"] {
        &:before {
          background: transparent;
          box-shadow: inset 0px 0px 0px 2px ${colors.darkGrey};
        }
      }
      padding-left: 1.5rem;
      &:before {
        content: "";
        position: absolute;
        left: 0.25rem;
        top: 50%;
        transform: translate(0.25rem, -50%);
        width: 0.5rem;
        height: 0.5rem;
        background: ${colors.darkGrey};
        opacity: 0.6;
        border-radius: 50%;
      }
    }
  }
`;

const Status = styled.div<{
  $background: string;
  $color: string;
  $size: Props["size"];
}>`
  text-transform: uppercase;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.$background};
  }
  color: ${(props) => props.$color};
  padding: ${({ $size }) =>
    $size === "regular"
      ? "0.5rem 1rem"
      : $size === "small"
      ? "0.4375rem 0.625rem"
      : "0.75rem 1.5rem"};
  font-family: ${defaultFontFamily};
  font-style: normal;
  font-size: ${({ $size }) =>
    $size === "regular"
      ? "0.875rem"
      : $size === "small"
      ? "0.75rem"
      : "0.1rem"};

  font-weight: 600;
  line-height: 1.5;
`;

interface Props {
  offer: Offer;
  exchange: Exchange;
  style?: React.CSSProperties;
  statusStyle?: React.CSSProperties;
  showValid?: boolean;
  displayDot?: boolean;
  size?: "small" | "regular" | "large";
  isDisputeSubState?: boolean;
}
interface StatusToComponentProps {
  style?: React.CSSProperties;
  size?: "small" | "regular" | "large";
  exchange: Exchange;
  isDisputeSubState: boolean;
}

const StatusToComponent = (
  { size, style, exchange, isDisputeSubState }: StatusToComponentProps,
  type: string
) => {
  const { status, color, background } = useDisputeSubStatusInfo(exchange);
  const disputeStatus = () => {
    return (
      <Status
        $color={color}
        $background={background}
        $size={size}
        style={style}
        className="status"
        data-testid={`${status}-status`}
      >
        {status}
      </Status>
    );
  };

  if (exchange.disputed && isDisputeSubState) {
    return disputeStatus();
  }
  const component = () => {
    return {
      [subgraph.ExchangeState.Cancelled]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.red}
          $size={size}
          style={style}
          className="status"
          data-testid="cancelled-status"
        >
          Cancelled
        </Status>
      ),
      [subgraph.ExchangeState.Committed]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.green}
          $size={size}
          style={style}
          className="status"
          data-testid="committed-status"
        >
          Committed
        </Status>
      ),
      [subgraph.ExchangeState.Completed]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.lightGrey}
          $size={size}
          style={style}
          className="status"
          data-testid="completed-status"
        >
          Completed
        </Status>
      ),
      [subgraph.ExchangeState.Disputed]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.torquise}
          $size={size}
          style={style}
          className="status"
          data-testid="disputed-status"
        >
          In Dispute
        </Status>
      ),
      [subgraph.ExchangeState.Revoked]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.blue}
          $size={size}
          style={style}
          className="status"
          data-testid="revoked-status"
        >
          Revoked
        </Status>
      ),
      [subgraph.ExchangeState.Redeemed]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.lime}
          $size={size}
          style={style}
          className="status"
          data-testid="redeemed-status"
        >
          Redeemed
        </Status>
      ),
      [exchanges.ExtendedExchangeState.Expired]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.red}
          $size={size}
          style={style}
          className="status"
          data-testid="expired-status"
        >
          Expired
        </Status>
      ),
      [exchanges.ExtendedExchangeState.NotRedeemableYet]: (
        <Status
          $color={colors.darkGrey}
          $background={colors.darkOrange}
          $size={size}
          style={style}
          className="status"
          data-testid="not_redeemable_yet-status"
        >
          Not redeemable yet
        </Status>
      )
      // eslint-disable-next-line
    }[type];
  };

  return component();
};

export default function ExchangeStatuses({
  offer,
  exchange,
  style,
  statusStyle,
  displayDot = false,
  size = "regular",
  isDisputeSubState = false
}: Props) {
  const status = useMemo(
    () =>
      exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment),
    [exchange]
  );
  const Component = StatusToComponent(
    { size, style: statusStyle, exchange: exchange, isDisputeSubState },
    status
  );
  const isMetadataValid = offer.isValid;

  return (
    <Statuses data-testid="statuses" data-dot={displayDot} style={style}>
      {Component && Component}
      {!isMetadataValid && (
        <Status
          $color={colors.white}
          $background={colors.black}
          $size={size}
          className="status"
          data-testid="unsupported-status"
        >
          Unsupported
        </Status>
      )}
    </Statuses>
  );
}
