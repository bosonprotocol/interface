import Avatar from "@davatar/react";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import styled, { css } from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Image from "../../../components/ui/Image";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { AvatarContainer, ProfileSectionWrapper } from "../ProfilePage.styles";

const smallHeight = "9rem";
const bigHeight = "11.875rem";

const ButtonsContainer = styled.div`
  width: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  ${breakpoint.s} {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  box-sizing: border-box;
`;

const BannerImageLayer = styled.div`
  position: absolute;
  top: 0;
  height: ${smallHeight};
  ${breakpoint.s} {
    height: ${bigHeight};
  }
`;

const WrapperWrapper = styled.div.attrs({ "data-wrapper-wrapper": true })`
  width: 100%;
  border: 1px solid green;
  display: flex;
  overflow: hidden;
  align-items: center;
  position: relative;
  height: ${smallHeight};
  ${breakpoint.s} {
    height: ${bigHeight};
  }
  img {
    flex: 1;
  }
`;

const StyledBannerImage = styled.img<{ $isObjectFitContain: boolean }>`
  pointer-events: auto;
  max-width: 100%;
  transform: none !important;
  ${({ $isObjectFitContain }) => {
    if ($isObjectFitContain) {
      return css`
        object-fit: contain;
        /* width: 100%; */
        max-height: 100%;
      `;
    }
    return css`
      object-fit: cover;
      width: 100%;
      position: absolute;

      height: ${smallHeight};
      ${breakpoint.s} {
        height: ${bigHeight};
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
}

const SellerImagesSection: React.FC<SellerImagesSectionProps> = ({
  coverImage,
  profileImage,
  address: currentSellerAddress,
  draggable
}) => {
  const { isLteXS } = useBreakpoints();
  const [defaultPosition, setDefaultPosition] = useState<number>(0);
  const handleReset = () => {
    setDefaultPosition((prev) => prev + 1);
  };
  const [isObjectFitContain, setObjectFitContain] = useState<boolean>(true);
  const imageRef = useRef<HTMLImageElement>(null);
  return (
    <Grid flexDirection="column">
      <ButtonsContainer>
        <Grid marginBottom="1rem" justifyContent="space-between" gap="1rem">
          <Button
            type="button"
            onClick={() => {
              setObjectFitContain((prev) => !prev);
              if (imageRef.current) {
                imageRef.current.style.objectPosition = "center";
              }
              handleReset();
            }}
          >
            object-fit: {isObjectFitContain ? "contain" : "cover"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (imageRef.current) {
                imageRef.current.style.objectPosition = "center";
              }
              handleReset();
            }}
          >
            Reset
          </Button>
        </Grid>
      </ButtonsContainer>
      <ProfileSectionWrapper>
        <WrapperWrapper>
          <Draggable
            // bounds="parent"
            // key={"" + defaultPosition}
            disabled={!draggable}
            onDrag={(e, data) => {
              console.log("e", e, "data", data);
              data.node.style.objectPosition = `${data.x}px ${data.y}px`;
              if (!isObjectFitContain) {
                // data.node.style.clipPath = `polygon(0 ${data.y}px, 100% ${data.y}px, 100% 63%, 0 63%)`;
              }
            }}
          >
            <StyledBannerImage
              ref={imageRef}
              src={
                "https://ik.imagekit.io/lens/media-snapshot/b7c1682e55814fec77bedc631f7713a64ba56b3d05c0ed3c3078bfacae519750.webp?img-format=auto" ||
                coverImage ||
                whiteImg
              }
              data-cover-img
              draggable={false}
              $isObjectFitContain={!!isObjectFitContain}
            />
          </Draggable>
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
              <Avatar
                address={currentSellerAddress}
                size={!isLteXS ? 160 : 80}
              />
            )}
          </AvatarContainer>
        </BannerImageLayer>
      </ProfileSectionWrapper>
    </Grid>
  );
};

export default SellerImagesSection;
