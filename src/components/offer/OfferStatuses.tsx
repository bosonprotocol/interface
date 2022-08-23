import { offers } from "@bosonprotocol/react-kit";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";

const Statuses = styled.div`
  position: absolute;
  right: -1rem;
  top: 1rem;
  display: flex;
  gap: 0.125rem;
  z-index: ${zIndex.OfferStatus};
  [data-dot] {
    padding-left: 1rem;
    :before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 0.5rem;
      height: 0.5rem;

      background: ${colors.darkGrey}
      opacity: 0.6;
    }
  }
`;

const Status = styled.div<{
  $background: string;
  $color: string;
  $size: Props["size"];
}>`
  background: ${({ $background }) => $background || colors.white};
  color: ${({ $color }) => $color || colors.black};
  padding: ${({ $size }) =>
    $size === "regular"
      ? "0.5rem 1rem"
      : $size === "small"
      ? "0.25rem 0.375rem"
      : "0.75rem 1.5rem"};
  font-family: "Plus Jakarta Sans";
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
  style?: React.CSSProperties;
  statusStyle?: React.CSSProperties;
  showValid?: boolean;
  displayDot?: boolean;
  size?: "small" | "regular" | "large";
}

interface StatusToComponentProps {
  style?: React.CSSProperties;
  size?: "small" | "regular" | "large";
}

const StatusToComponent = (
  { size, style }: StatusToComponentProps,
  type: string
) => {
  const component = () =>
    ({
      [offers.OfferState.EXPIRED]: (
        <Status
          $color={colors.darkGrey}
          $size={size}
          $background={`${colors.red}33`}
          className="status"
          data-testid="expired-status"
          style={style}
        >
          Expired
        </Status>
      ),
      [offers.OfferState.VOIDED]: (
        <Status
          $color={colors.darkGrey}
          $size={size}
          $background={`${colors.darkGrey}33`}
          className="status"
          data-testid="voided-status"
          style={style}
        >
          Voided
        </Status>
      ),
      [offers.OfferState.NOT_YET_VALID]: (
        <Status
          $color={colors.darkGrey}
          $size={size}
          $background={`${colors.orange}33`}
          className="status"
          data-testid="not_yet_valid-status"
          style={style}
        >
          Not yet valid
        </Status>
      ),
      [offers.OfferState.VALID]: (
        <Status
          $color={colors.darkGrey}
          $size={size}
          $background={`${colors.lime}33`}
          className="status"
          data-testid="valid-status"
          style={style}
        >
          Valid
        </Status>
      )
      // eslint-disable-next-line
    }[type]);

  return component();
};

export default function OfferStatuses({
  offer,
  style,
  statusStyle,
  showValid = false,
  displayDot = false,
  size = "regular"
}: Props) {
  const [status] = useState<string>(offers.getOfferStatus(offer));
  const displayComponent = showValid
    ? true
    : status !== offers.OfferState.VALID;
  const Component = StatusToComponent({ size, style: statusStyle }, status);
  const isMetadataValid = offer.isValid;

  return (
    <Statuses data-testid="statuses" data-dot={displayDot} style={style}>
      {Component && displayComponent && Component}
      {!isMetadataValid && (
        <Status
          $color={colors.white}
          $background={colors.black}
          $size={size}
          className="status"
          data-testid="unsupported-status"
          style={statusStyle}
        >
          Unsupported
        </Status>
      )}
    </Statuses>
  );
}
