import styled from "styled-components";

import { GridContainer } from "../../components/ui/GridContainer";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

export const ProfileSectionWrapper = styled.div`
  max-width: 68.75rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  ${breakpoint.s} {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  box-sizing: border-box;
`;

export const GrayWrapper = styled.div`
  background-color: var(--secondary);
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 2.25rem 0;
  ${breakpoint.s} {
    padding: 5rem 0;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    width: 100%;
    height: 1px;
    box-shadow: 0px 0 10px rgba(0, 0, 0, 0.4);
    background: transparent;
  }
`;

export const BasicInfo = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0rem;
`;

export const BannerImage = styled.img`
  height: 9rem;
  ${breakpoint.s} {
    height: 11.875rem;
  }
  width: 100vw;
  object-fit: cover;
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;
`;

export const BannerImageLayer = styled.div`
  position: relative;
  ${breakpoint.s} {
    height: 11.875rem;
  }
`;

export const avatarHeight = "7.25rem";
export const AvatarContainer = styled.div`
  display: flex;
  margin-top: 4.5rem;
  ${breakpoint.s} {
    margin-top: 0;
    position: absolute;
    top: 50%;
    z-index: ${zIndex.OfferStatus};
  }
  > div {
    width: 7.25rem !important;
    height: ${avatarHeight} !important;
    overflow: hidden;
    ${breakpoint.s} {
      top: 50%;
      width: 10rem !important;
      height: 10rem !important;
    }
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 2rem;
  flex-basis: 50%;
  margin-top: 0.5rem;
  [data-addrest-text] {
    color: ${colors.darkGrey};
    font-size: 1.25rem;
  }
  ${breakpoint.s} {
    margin-top: 0;
    font-size: 1rem;
  }
`;

export const AvatarEmptySpace = styled.div`
  ${breakpoint.s} {
    min-width: 11rem;
  }
`;

export const SocialIconContainer = styled.div`
  display: flex;
  align-items: center;
  svg {
    color: ${colors.secondary};
    vertical-align: bottom;
  }
`;

export const SocialIcon = styled.a<{ $isDisabled: boolean }>`
  margin-left: 1.5rem;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "default" : "pointer")};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "auto")};
`;

export const DetailShareWrapper = styled.div`
  position: relative;
  margin-left: 1.5rem;
  [data-name="detail-share-wrapper"] {
    position: relative;
    top: auto;
    right: auto;
    button {
      padding: 0 !important;
      margin: 0;
    }
  }
`;

export const LoadingWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.secondary};
`;

export const ProductGridContainer = styled(GridContainer)`
  grid-row-gap: 3.5rem;
  ${breakpoint.s} {
    grid-row-gap: 2rem;
  }
`;
