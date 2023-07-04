import Avatar from "@davatar/react";
import { useFormikContext } from "formik";
import { ArrowsClockwise } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import styled, { css } from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import { Switch } from "../../../components/form/Switch";
import { FileProps } from "../../../components/form/Upload/types";
import { LensProfileType } from "../../../components/modal/components/Profile/Lens/validationSchema";
import { CreateProfile } from "../../../components/product/utils";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Image from "../../../components/ui/Image";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { getIpfsGatewayUrl } from "../../../lib/utils/ipfs";
import { AvatarContainer } from "../ProfilePage.styles";

const smallHeight = "9rem";
const bigHeight = "11.875rem";

const ProfileSectionWrapper = styled.div`
  position: relative;
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
  border: 1px solid ${colors.lightGrey};
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

const StyledBannerImage = styled.img<{
  $isObjectFitContain: boolean;
  $objectPosition: string;
}>`
  pointer-events: auto;
  max-width: 100%;
  transform: none !important;
  height: 100%;
  ${({ $objectPosition }) => {
    return css`
      object-position: ${$objectPosition};
    `;
  }};

  ${({ $isObjectFitContain }) => {
    if ($isObjectFitContain) {
      return css`
        object-fit: contain;
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
  metadataCoverImage?:
    | (FileProps & {
        fit?: string | undefined;
        position?: string | undefined;
      })
    | undefined;
  profileImage?: string;
  address: string;
  draggable?: boolean;
  defaultPosition?: { x: number; y: number };
  defaultIsObjectFitContain?: boolean;
}

const SellerImagesSection: React.FC<SellerImagesSectionProps> = ({
  metadataCoverImage,
  profileImage,
  address: currentSellerAddress,
  draggable,
  defaultPosition,
  defaultIsObjectFitContain,
  ...rest
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext<CreateProfile>();
  const setCoverTouched = (touched: boolean) =>
    setFieldTouched("coverPicture", touched);
  const setCoverImage = (
    coverPicture:
      | CreateProfile["coverPicture"]
      | LensProfileType["coverPicture"]
  ) => {
    setFieldValue("coverPicture", coverPicture);
    setCoverTouched(true);
  };
  const { isLteXS } = useBreakpoints();
  const [position, setPosition] = useState<{ x: number; y: number }>(
    defaultPosition ?? {
      x: 0,
      y: 0
    }
  );
  const [isObjectFitContain, setObjectFitContain] = useState<boolean>(
    !!defaultIsObjectFitContain
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const applyPosition = (newPosition: { x: number; y: number }) => {
    if (!metadataCoverImage) {
      return;
    }
    metadataCoverImage.position = `${newPosition.x}px ${newPosition.y}px`;
  };
  const applyFit = (objectFitContain: boolean) => {
    if (!metadataCoverImage) {
      return;
    }
    if (objectFitContain) {
      metadataCoverImage.fit = "contain";
    } else {
      metadataCoverImage.fit = "cover";
    }
  };
  useEffect(() => {
    if (
      metadataCoverImage &&
      (metadataCoverImage.fit === undefined ||
        metadataCoverImage.position === undefined)
    ) {
      applyPosition(position);
      applyFit(isObjectFitContain);
      setCoverImage([metadataCoverImage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataCoverImage?.fit, metadataCoverImage?.position]);
  const handlePosition = (
    newPosition: { x: number; y: number },
    save: boolean
  ) => {
    setPosition(newPosition);
    if (metadataCoverImage && save) {
      applyPosition(newPosition);
      setCoverImage([metadataCoverImage]);
    }
    return newPosition;
  };
  const handleReset = () => {
    if (imageRef.current) {
      imageRef.current.style.objectPosition = "0px 0px";
    }
    setPosition({ x: 0, y: 0 });
  };
  const handleChangeObjectFitContain = () => {
    const newFit = !isObjectFitContain;
    setObjectFitContain(newFit);
    applyFit(newFit);
    if (metadataCoverImage) {
      setCoverImage([metadataCoverImage]);
    }

    handleReset();
  };
  const coverImageUrl = getIpfsGatewayUrl(metadataCoverImage?.src ?? "");
  const disabled = !draggable || !coverImageUrl;
  const defaultObjectPosition =
    defaultPosition || draggable
      ? `${defaultPosition?.x || 0}px ${defaultPosition?.y || 0}px`
      : "";
  return (
    <Grid flexDirection="column" {...rest}>
      {!disabled && (
        <ButtonsContainer>
          <Grid marginBottom="1rem" justifyContent="space-between" gap="1rem">
            <Switch
              onCheckedChange={() => {
                handleChangeObjectFitContain();
              }}
              checked={!isObjectFitContain}
              label={() => (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleChangeObjectFitContain()}
                >
                  Fit: {isObjectFitContain ? "Contain" : "Cover"}
                </div>
              )}
            />
            <Button
              theme="outline"
              onClick={() => {
                handleReset();
              }}
            >
              Reset
              <ArrowsClockwise size={30} />
            </Button>
          </Grid>
        </ButtonsContainer>
      )}
      <ProfileSectionWrapper>
        <WrapperWrapper>
          <Draggable
            position={position}
            disabled={disabled}
            onStart={(_, data) => {
              const { x, y } = handlePosition({ x: data.x, y: data.y }, false);
              data.node.style.objectPosition = `${x}px ${y}px`;
            }}
            onDrag={(_, data) => {
              const { x, y } = handlePosition({ x: data.x, y: data.y }, false);
              data.node.style.objectPosition = `${x}px ${y}px`;
            }}
            onStop={(_, data) => {
              const { x, y } = handlePosition({ x: data.x, y: data.y }, true);
              data.node.style.objectPosition = `${x}px ${y}px`;
            }}
          >
            <StyledBannerImage
              ref={imageRef}
              $objectPosition={defaultObjectPosition}
              src={coverImageUrl || whiteImg}
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
