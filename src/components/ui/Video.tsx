import { Loading } from "@bosonprotocol/react-kit";
import { VideoCamera as VideoIcon, VideoCameraSlash } from "phosphor-react";
import { useEffect, useState, VideoHTMLAttributes } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { fetchIpfsBase64Media } from "../../lib/utils/base64";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { buttonText } from "./styles";
import Typography from "./Typography";

const VideoWrapper = styled.div`
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  height: 0;
  padding-top: 120%;
  font-size: inherit;

  > video,
  > div[data-testid="video"] {
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

const VideoContainer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPlaceholder = styled.div`
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

interface IVideo {
  src: string;
  children?: React.ReactNode;
  dataTestId?: string;
  showPlaceholderText?: boolean;
  noPreload?: boolean;
  videoProps?: VideoHTMLAttributes<HTMLElement>;
}
const Video: React.FC<IVideo & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "video",
  showPlaceholderText = true,
  noPreload = false,
  videoProps,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(noPreload);
  const [isError, setIsError] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(
    noPreload ? src : null
  );
  const ipfsMetadataStorage = useIpfsStorage();

  useEffect(() => {
    async function fetchData(src: string) {
      if (ipfsMetadataStorage && !src?.includes("undefined")) {
        try {
          const [base64str] = await fetchIpfsBase64Media(
            [src],
            ipfsMetadataStorage
          );
          setVideoSrc(base64str as string);
        } catch (error) {
          console.error("error in Video", error);
          setIsLoaded(true);
          setIsError(true);
        }
      } else {
        setIsLoaded(true);
        setIsError(true);
      }
    }
    if (!isLoaded && videoSrc === null) {
      if (src?.includes("ipfs://")) {
        const newString = src.split("//");
        const CID = newString[newString.length - 1];
        fetchData(`ipfs://${CID}`);
      } else {
        setVideoSrc(src);
      }
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (videoSrc !== null) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [videoSrc]);

  if (!isLoaded && !isError) {
    return (
      <VideoWrapper {...rest}>
        <VideoPlaceholder>
          <Typography tag="div">
            <Loading />
          </Typography>
        </VideoPlaceholder>
      </VideoWrapper>
    );
  }

  if (isLoaded && isError) {
    return (
      <VideoWrapper {...rest}>
        <VideoPlaceholder data-video-placeholder>
          {showPlaceholderText ? (
            <VideoIcon size={50} color={colors.white} />
          ) : (
            <VideoCameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">VIDEO NOT AVAILABLE</Typography>
          )}
        </VideoPlaceholder>
      </VideoWrapper>
    );
  }

  return (
    <VideoWrapper {...rest}>
      {children || ""}
      {videoSrc && (
        <VideoContainer
          data-testid={dataTestId}
          {...videoProps}
          src={videoSrc}
        />
      )}
    </VideoWrapper>
  );
};

export default Video;
