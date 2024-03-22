import { Loading, MuteButton } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { VideoCamera as VideoIcon, VideoCameraSlash } from "phosphor-react";
import React, {
  ElementRef,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  VideoHTMLAttributes
} from "react";
import styled, { css } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { fetchIpfsBase64Media } from "../../lib/utils/base64";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { buttonText } from "./styles";
import { Typography } from "./Typography";
const StyledMuteButton = styled(MuteButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
const VideoWrapper = styled.div<{ $hasOnClick?: boolean }>`
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  height: 0;
  padding-top: 120%;
  font-size: inherit;
  ${({ $hasOnClick }) =>
    $hasOnClick &&
    css`
      cursor: pointer;
    `}

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
  object-fit: contain;
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
  children?: ReactNode;
  dataTestId?: string;
  showPlaceholderText?: boolean;
  noPreload?: boolean;
  videoProps?: VideoHTMLAttributes<HTMLElement>;
  componentWhileLoading?: () => ReactElement;
}
const Video: React.FC<IVideo & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "video",
  showPlaceholderText = true,
  noPreload = false,
  videoProps,
  componentWhileLoading: ComponentWhileLoading,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { muted: _, ...vidProps } = videoProps ?? {};
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
          Sentry.captureException(error);
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
      } else if (src?.startsWith("undefined") && src?.length > 9) {
        const CID = src.replace("undefined", "");
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

  const mp4Src = useMemo(() => {
    const octetSrc =
      videoSrc?.startsWith("data:application/octet-stream;base64,") || false;

    if (videoSrc && octetSrc) {
      return `data:video/mp4;base64,${videoSrc?.replace(
        "data:application/octet-stream;base64,",
        ""
      )}`;
    }
    return videoSrc || "";
  }, [videoSrc]);
  const videoRef = useRef<ElementRef<"video">>(null);
  const [muted, setMuted] = useState<boolean>(!!videoProps?.muted);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = muted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current?.defaultMuted]);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.autoplay = false;
      videoRef.current.pause();
      videoRef.current.muted = muted;
      videoRef.current.play();
    }
  }, [muted]);
  if (!isLoaded && !isError) {
    if (ComponentWhileLoading) {
      return <ComponentWhileLoading />;
    }
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
    <VideoWrapper {...rest} $hasOnClick={!!rest.onClick}>
      {children || ""}
      {videoSrc && (
        <>
          <StyledMuteButton
            muted={muted}
            onClick={() => setMuted((prev) => !prev)}
          />
          <VideoContainer
            ref={videoRef}
            data-testid={dataTestId}
            {...vidProps}
            src={mp4Src || ""}
          />
        </>
      )}
    </VideoWrapper>
  );
};

export default Video;
