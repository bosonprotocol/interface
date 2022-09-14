import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";

const BannerContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-bottom: 2px solid ${colors.black}20;
  background: ${colors.white};
  font-size: 12px;
  line-height: 11px;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  z-index: ${zIndex.OfferStatus};
`;

interface Props {
  offer: Offer;
  type?: "gone" | "hot" | "soon" | undefined;
}

export default function OfferBanner({ offer }: Props) {
  const handleText = useHandleText(offer);
  return (
    <BannerContainer data-banner data-testid="offer-banner">
      {handleText}
    </BannerContainer>
  );
}
