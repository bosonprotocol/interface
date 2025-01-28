import { subgraph } from "@bosonprotocol/react-kit";
import Avatar from "@davatar/react";
import React from "react";
import styled, { css } from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Image from "../../../components/ui/Image";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import {
  AvatarContainer,
  BannerImageLayer,
  ProfileSectionWrapper
} from "../ProfilePage.styles";

const StyledBannerImage = styled.img<{
  $objectFit?: string | null;
  $objectPosition?: string | null;
}>`
  height: 9rem;
  ${breakpoint.s} {
    height: 11.875rem;
  }
  width: 100vw;
  object-fit: cover;
  ${({ $objectFit }) => {
    if ($objectFit) {
      return css`
        object-fit: ${$objectFit};
      `;
    }
    return css`
      object-fit: cover;
    `;
  }}
  ${({ $objectPosition }) => {
    if ($objectPosition) {
      return css`
        object-position: ${$objectPosition};
      `;
    }
    return css``;
  }}
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;
  max-width: 100%;
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
  coverImageUrl?: string;
  metadataCoverImage?: Pick<subgraph.SellerMetadataMedia, "fit" | "position">;
  profileImage?: string;
  address: string;
}

export const SellerImagesSectionView: React.FC<SellerImagesSectionProps> = ({
  coverImageUrl,
  metadataCoverImage,
  profileImage,
  address: currentSellerAddress
}) => {
  const { isLteXS } = useBreakpoints();
  return (
    <ProfileSectionWrapper>
      <StyledBannerImage
        src={coverImageUrl || whiteImg}
        data-cover-img
        style={{ border: `1px solid ${colors.greyLight}` }}
        $objectFit={metadataCoverImage?.fit}
        $objectPosition={metadataCoverImage?.position}
      />
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
