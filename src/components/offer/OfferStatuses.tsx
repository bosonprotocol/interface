import { offers } from "@bosonprotocol/react-kit";
import { useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { getProductStatusBasedOnVariants } from "../../lib/utils/getProductStatusBasedOnVariants";

const Statuses = styled.div`
  position: absolute;
  right: -1rem;
  top: 1rem;
  display: flex;
  gap: 0.125rem;
  z-index: ${zIndex.OfferStatus};
  &[data-dot="true"] {
    > div {
      :after {
        opacity: 0.2;
      }
      &[data-testid="voided-status"] {
        :before {
          background: transparent;
          box-shadow: inset 0px 0px 0px 2px ${colors.darkGrey};
        }
      }
      padding-left: 1.5rem;
      :before {
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
  position: relative;
  :after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.$background};
  }
  color: ${({ $color }) => $color || colors.black};
  padding: ${({ $size }) =>
    $size === "regular"
      ? "0.5rem 1rem"
      : $size === "small"
      ? "0.4375rem 0.625rem"
      : "0.75rem 1.5rem"};
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: ${({ $size }) =>
    $size === "regular"
      ? "0.875rem"
      : $size === "small"
      ? "0.75rem"
      : "0.1rem"};

  text-transform: uppercase;
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
          $background={`${colors.red}`}
          $size={size}
          style={style}
          className="status"
          data-testid="expired-status"
        >
          Expired
        </Status>
      ),
      [offers.OfferState.VOIDED]: (
        <Status
          $color={colors.darkGrey}
          $background={`${colors.darkGrey}`}
          $size={size}
          style={style}
          className="status"
          data-testid="voided-status"
        >
          Voided
        </Status>
      ),
      [offers.OfferState.NOT_YET_VALID]: (
        <Status
          $color={colors.darkGrey}
          $background={`${colors.orange}`}
          $size={size}
          style={style}
          className="status"
          data-testid="not_yet_valid-status"
        >
          Not yet valid
        </Status>
      ),
      [offers.OfferState.VALID]: (
        <Status
          $color={colors.darkGrey}
          $background={`${colors.lime}`}
          $size={size}
          style={style}
          className="status"
          data-testid="valid-status"
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
  const status = useMemo(() => {
    return offer?.additional?.variants?.length
      ? getProductStatusBasedOnVariants(offer?.additional?.variants)
      : offers.getOfferStatus(offer);
  }, [offer]);
  const displayComponent = showValid
    ? true
    : status !== offers.OfferState.VALID;
  const Component = StatusToComponent({ size, style: statusStyle }, status);
  const isMetadataValid = offer.isValid;

  return (
    <Statuses data-testid="statuses" data-dot={displayDot} style={style}>
      {displayComponent && Component}
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
