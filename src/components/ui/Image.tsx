import { Loading } from "@bosonprotocol/react-kit";
import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import {
  getFallbackImageUrl,
  getImageUrl,
  ImageOptimizationOpts
} from "../../lib/utils/images";
import { Typography } from "./Typography";

type LoadingStatus = "loading" | "success" | "error";

const ImageWrapper = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? "none !important" : undefined)};
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  height: 0;
  padding-top: 120%;
  font-size: inherit;

  > img,
  > div[data-testid="image"] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
    pointer-events: none;
  }

  [data-testid="statuses"] {
    position: absolute;
    z-index: ${zIndex.OfferStatus};
    top: 1rem;
    right: -1rem;
    margin: 0 auto;
    justify-content: flex-end;
  }
`;

const ImageContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.darkGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    ${buttonText}
    font-size: inherit;
    line-height: 1;
    color: ${colors.white};
    padding: 1rem;
    text-align: center;
  }
`;

interface IImage {
  src: string;
  children?: React.ReactNode;
  dataTestId?: string;
  alt?: string;
  showPlaceholderText?: boolean;
  withLoading?: boolean;
  optimizationOpts?: Partial<ImageOptimizationOpts> & {
    gateway: string;
  };
  onSetStatus?: (status: LoadingStatus) => void;
}
const Image: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  showPlaceholderText = true,
  withLoading = true,
  optimizationOpts,
  onSetStatus,
  ...rest
}) => {
  const [status, setStatus] = useState<LoadingStatus>(
    withLoading ? "loading" : "success"
  );
  const handleSetStatus = (innerStatus: LoadingStatus) => {
    setStatus(innerStatus);
    onSetStatus?.(innerStatus);
  };
  const [currentSrc, setCurrentSrc] = useState<string>(
    getImageUrl(src, optimizationOpts)
  );
  const [didOriginalSrcFail, setDidOriginalSrcFail] = useState<boolean>(false);
  useEffect(() => {
    if (src === currentSrc) {
      return;
    }
    // reset all if src changes
    setStatus(withLoading ? "loading" : "success");
    setCurrentSrc(getImageUrl(src, optimizationOpts));
    setDidOriginalSrcFail(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  alt === "token ID 1" && console.log({ currentSrc, status, alt });
  return (
    <>
      <ImageWrapper {...rest} hide={!isLoading}>
        <ImagePlaceholder>
          <Typography tag="div">
            <Loading />
          </Typography>
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} hide={!isError}>
        <ImagePlaceholder data-image-placeholder>
          {showPlaceholderText ? (
            <ImageIcon size={50} color={colors.white} />
          ) : (
            <CameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
          )}
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} hide={!isSuccess}>
        {children || ""}
        <ImageContainer
          data-testid={dataTestId}
          src={currentSrc}
          alt={alt}
          onLoad={() => handleSetStatus("success")}
          onError={() => {
            if (didOriginalSrcFail) {
              handleSetStatus("error");
            } else {
              setDidOriginalSrcFail(true);
              const fallbackUrl = getFallbackImageUrl(src, optimizationOpts);
              if (
                fallbackUrl.startsWith("unsafe:") ||
                fallbackUrl === currentSrc
              ) {
                handleSetStatus("error");
              } else {
                setCurrentSrc(fallbackUrl);
              }
            }
          }}
        />
      </ImageWrapper>
    </>
  );
};

export default Image;
