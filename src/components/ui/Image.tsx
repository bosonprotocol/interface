import { Loading } from "@bosonprotocol/react-kit";
import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { blobToBase64 } from "../../lib/utils/base64ImageConverter";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
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
  noPreload?: boolean;
}
const Image: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  showPlaceholderText = true,
  noPreload = false,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(noPreload);
  const [isError, setIsError] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(
    noPreload ? src : null
  );
  const ipfsMetadataStorage = useIpfsStorage();

  useEffect(() => {
    async function fetchData(src: string) {
      const fetchPromises = await ipfsMetadataStorage.get(src, false);
      const [image] = await Promise.all([fetchPromises]);
      const base64str = await blobToBase64(new Blob([image as BlobPart]));

      if (!String(base64str).includes("base64")) {
        setIsLoaded(true);
        setIsError(true);
      } else {
        setImageSrc(base64str as string);
      }
    }
    if (!isLoaded && imageSrc === null) {
      if (src?.includes("ipfs://")) {
        fetchData(src);
      } else {
        setImageSrc(src);
      }
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (imageSrc !== null) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [imageSrc]);

  if (!isLoaded && !isError) {
    return (
      <ImageWrapper {...rest}>
        <ImagePlaceholder>
          <Typography tag="div">
            <Loading />
          </Typography>
        </ImagePlaceholder>
      </ImageWrapper>
    );
  }

  if (isLoaded && isError) {
    return (
      <ImageWrapper {...rest}>
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
    );
  }

  return (
    <ImageWrapper {...rest}>
      {children || ""}
      {imageSrc && (
        <ImageContainer data-testid={dataTestId} src={imageSrc} alt={alt} />
      )}
    </ImageWrapper>
  );
};

export default Image;
