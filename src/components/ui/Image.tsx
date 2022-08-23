import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "../../components/ui/styles";
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

const handleIPFS = async (src: string): Promise<string | null> => {
  if (src) {
    if (!src.includes("ipfs://")) {
      return src;
    } else {
      return new Promise((resolve) =>
        fetch(src)
          .then(async (response) => {
            if (response.status === 200) {
              resolve(response.text());
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            console.log(error);
            resolve(null);
          })
      );
    }
  }

  return null;
};

const Image: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  showPlaceholderText = true,
  ...rest
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const getIPFS = useCallback(async () => {
    const newSrc = await handleIPFS(src);
    setImageSrc(newSrc);
  }, [src, setImageSrc]);

  useEffect(() => {
    getIPFS();
  }, [getIPFS]);

  return (
    <ImageWrapper {...rest}>
      {children || ""}
      {imageSrc ? (
        <ImageContainer data-testid={dataTestId} src={imageSrc} alt={alt} />
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
