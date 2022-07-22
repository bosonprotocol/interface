import { Image as ImageIcon } from "phosphor-react";
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
  height: 100%;
  width: 100%;
  background-color: ${colors.darkGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    fill: ${colors.white};
  }

  span {
    ${buttonText}
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
}

const Image: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  ...rest
}) => {
  return (
    <ImageWrapper {...rest}>
      {children || ""}
      {src ? (
        <ImageContainer data-testid={dataTestId} src={src} alt={alt} />
      ) : (
        <ImagePlaceholder>
          <ImageIcon size={50} />
          <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
        </ImagePlaceholder>
      )}
    </ImageWrapper>
  );
};

export default Image;
