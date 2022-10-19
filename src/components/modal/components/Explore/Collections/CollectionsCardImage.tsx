import { Image } from "@bosonprotocol/react-kit";
import { CameraSlash } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import { ProgressStatus } from "../../../../../lib/types/progressStatus";
import { useGetIpfsImage } from "../../../../../lib/utils/hooks/useGetIpfsImage";
import { Spinner } from "../../../../loading/Spinner";

const StyledSpinner = styled(Spinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-left: -1.25rem;
  margin-top: -1.25rem;
  color: ${colors.white};
  svg {
    color: ${colors.white};
  }
`;

const SpinnerContainer = styled.div`
  position: relative;
  background: ${colors.darkGrey};
`;

function CollectionsCardImage({ imageSource }: any) {
  const { imageStatus, imageSrc } = useGetIpfsImage(imageSource);

  const imageProps = {
    src: imageSrc,
    preloadConfig: {
      status: imageStatus,
      errorIcon: <CameraSlash size={32} color={colors.white} />
    }
  };
  if (imageStatus === ProgressStatus.LOADING) {
    return (
      <SpinnerContainer>
        <StyledSpinner />
      </SpinnerContainer>
    );
  }

  return <Image {...imageProps} />;
}

export default CollectionsCardImage;
