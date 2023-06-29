import Avatar from "@davatar/react";
import React from "react";
import Draggable from "react-draggable";
import styled, { css } from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Image from "../../../components/ui/Image";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import {
  AvatarContainer,
  // BannerImageLayer,
  ProfileSectionWrapper
} from "../ProfilePage.styles";

// const StyledBannerImage = styled(BannerImage)`
//   max-width: 100%;
// `;

const BannerImageLayer = styled.div`
  position: absolute;
  top: 0;
  ${breakpoint.s} {
    height: 11.875rem;
  }
`;

const WrapperWrapper = styled.div.attrs({ "data-wrapper-wrapper": true })`
  border: 1px solid green;
  display: flex;
  align-items: center;
  position: relative;
  height: calc(9rem + 20px);
  ${breakpoint.s} {
    height: calc(11.875rem + 20px);
  }
`;

const BannerWrapper = styled.div.attrs({ "data-banner-wrapper": true })<{
  $isTop: boolean;
}>`
  border: 1px solid red;
  pointer-events: none;
  overflow: hidden;
  background: blue;
  z-index: 1;
  position: absolute;
  ${({ $isTop }) => {
    return css`
      ${$isTop ? "top:0" : "bottom:0"};
    `;
  }}
  width: 100%;
  height: 10px;
`;

const StyledBannerImage = styled.img<{ $isObjectFitContain: boolean }>`
  pointer-events: auto;
  /* height: 9rem;
  ${breakpoint.s} {
    height: 11.875rem;
  } */
  /* width: 100vw; */
  /* object-fit: cover; */
  /*z-index: -1;
   position: absolute;
  left: 0;
  right: 0; */
  max-width: 100%;
  border: 1px solid ${colors.lightGrey};
  ${({ $isObjectFitContain }) => {
    if ($isObjectFitContain) {
      return css`
        object-fit: contain;
      `;
    }
    return css`
      object-fit: cover;
      height: 9rem;
      ${breakpoint.s} {
        height: 11.875rem;
      }
    `;
  }}
`;

const StyledImage = styled(Image)`
  img {
    object-fit: contain;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
`;

interface SellerImagesSectionProps {
  coverImage?: string;
  profileImage?: string;
  address: string;
  draggable?: boolean;
  isObjectFitContain?: boolean;
}

const SellerImagesSection: React.FC<SellerImagesSectionProps> = ({
  coverImage,
  profileImage,
  address: currentSellerAddress,
  draggable,
  isObjectFitContain
}) => {
  const { isLteXS } = useBreakpoints();
  return (
    <ProfileSectionWrapper>
      <WrapperWrapper>
        <BannerWrapper $isTop={true} />
        <Draggable
          // {...isObjectFitContain ? {bounds:'parent'}:{top: -10, left: -10, right: 10, bottom: 10}}
          // bounds={{ top: -10, left: -10, right: 10, bottom: 200 }}
          bounds="parent"
          disabled={!draggable}
          axis="y"
        >
          <StyledBannerImage
            src={coverImage || whiteImg}
            data-cover-img
            draggable={false}
            $isObjectFitContain={!!isObjectFitContain}
          />
        </Draggable>
        <BannerWrapper $isTop={false} />
      </WrapperWrapper>
      <BannerImageLayer>
        <AvatarContainer>
          {profileImage ? (
            <StyledImage
              src={profileImage}
              style={{
                width: "160px !important",
                height: "160px !important",
                paddingTop: "0",
                borderRadius: "50%",
                backgroundColor: "var(--primaryBgColor)"
              }}
            />
          ) : (
            <Avatar address={currentSellerAddress} size={!isLteXS ? 160 : 80} />
          )}
        </AvatarContainer>
      </BannerImageLayer>
    </ProfileSectionWrapper>
  );
};

export default SellerImagesSection;
