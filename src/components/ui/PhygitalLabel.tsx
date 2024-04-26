import { PhygitalLabel as ReactKitPhygitalLabel } from "@bosonprotocol/react-kit";
import { zIndex } from "lib/styles/zIndex";
import { styled } from "styled-components";

export const PhygitalLabel = styled(ReactKitPhygitalLabel)`
  z-index: ${zIndex.OfferCard + 1};
`;
