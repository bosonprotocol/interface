import { IoIosImage } from "react-icons/io";
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
    top: 5px;
    right: 5px;
    justify-content: flex-end;
  }
`;

const ImageContainer = styled.img`
  height: 100%;
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

const ImageNotAvailable = styled(IoIosImage)`
  font-size: 50px;
`;

const Image: React.FC<{
  src: string;
  children?: React.ReactNode;
}> = ({ src, children }) => {
  return (
    <ImageWrapper>
      {children || ""}
      {src ? (
        <ImageContainer data-testid="image" src={src} />
      ) : (
        <ImagePlaceholder>
          <ImageNotAvailable />
          <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
        </ImagePlaceholder>
      )}
    </ImageWrapper>
  );
};

export default Image;
