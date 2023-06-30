import Avatar from "@davatar/react";
import React from "react";
import styled from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Image from "../../../components/ui/Image";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import {
  AvatarContainer,
  BannerImage,
  BannerImageLayer,
  ProfileSectionWrapper
} from "../ProfilePage.styles";

const StyledBannerImage = styled(BannerImage)`
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
  coverImage?: string;
  profileImage?: string;
  address: string;
}

const SellerImagesSection: React.FC<SellerImagesSectionProps> = ({
  coverImage,
  profileImage,
  address: currentSellerAddress
}) => {
  const { isLteXS } = useBreakpoints();
  return (
    <ProfileSectionWrapper>
      <StyledBannerImage
        src={coverImage || whiteImg}
        data-cover-img
        style={{ border: `1px solid ${colors.lightGrey}` }}
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

export default SellerImagesSection;
