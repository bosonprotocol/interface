import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "../../components/ui/styles";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Typography from "./Typography";

const ImageWrapper = styled.div`
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
}

const Image: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  showPlaceholderText = true,
  ...rest
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(src: string) {
      const ipfsMetadataStorage = IpfsMetadataStorage.fromTheGraphIpfsUrl(
        CONFIG.ipfsMetadataUrl
      );

      const fetchPromises = await ipfsMetadataStorage.get(src, false);
      const [image] = await Promise.all([fetchPromises]);
      setImageSrc(String(image));
    }
    if (src.includes("ipfs://")) {
      fetchData(src);
    }
  }, [src]); // eslint-disable-line

  return (
    <ImageWrapper {...rest}>
      {children || ""}
      {imageSrc || src ? (
        <ImageContainer
          data-testid={dataTestId}
          src={imageSrc || src}
          alt={alt}
        />
      ) : (
        <ImagePlaceholder>
          {showPlaceholderText ? (
            <ImageIcon size={50} color={colors.white} />
          ) : (
            <CameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
          )}
        </ImagePlaceholder>
      )}
    </ImageWrapper>
  );
};

export default Image;
