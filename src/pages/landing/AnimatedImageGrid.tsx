import { Grid } from "@bosonprotocol/react-kit";
import { resolveUrlFromIPFS } from "lib/utils/hooks/useResolveUrlFromIPFS";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ImageItem = styled.div<ImageItemProps>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  transition: all 0.5s ease-in-out;
  opacity: 0.7;
  filter: blur(3px);
  animation: ${fadeIn} 0.5s ease-in-out;
  z-index: ${(props) => (props.isActive || props.isTransitioning ? 10 : 1)};

  ${(props) =>
    props.isActive &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40%;
      height: 40%;
      opacity: 1;
      filter: blur(0);
    `}
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const LoadingContainer = styled(Grid)`
  height: 100%;
  font-size: 18px;
  color: #333;
`;

interface ImageItemProps {
  top: string;
  left: string;
  width: string;
  height: string;
  isActive: boolean;
  isTransitioning: boolean;
}

interface AnimatedImageGridProps {
  images: string[];
}

const AnimatedImageGrid: React.FC<AnimatedImageGridProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioningIndex, setTransitioningIndex] = useState<number | null>(
    null
  );
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const imageItems: Omit<ImageItemProps, "isActive" | "isTransitioning">[] =
    useMemo(
      () => [
        { top: "0%", left: "40%", width: "20%", height: "20%" },
        { top: "3%", left: "84%", width: "20%", height: "20%" },
        { top: "45%", left: "86%", width: "20%", height: "20%" },
        { top: "85%", left: "60%", width: "20%", height: "20%" },
        { top: "20%", left: "10%", width: "20%", height: "20%" },
        { top: "45%", left: "0%", width: "20%", height: "20%" },
        { top: "85%", left: "25%", width: "20%", height: "20%" },
        { top: "43%", left: "43%", width: "20%", height: "20%" }
      ],
      []
    );

  useEffect(() => {
    const loadImages = async () => {
      const resolvedUrls = images.map((url) =>
        resolveUrlFromIPFS(url, "https://ipfs.io/ipfs")
      );
      const loadedUrls = await Promise.all(
        resolvedUrls.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          } catch (error) {
            console.error("Error loading image:", error);
            return null;
          }
        })
      );
      setLoadedImages(loadedUrls.filter(Boolean) as string[]);
    };

    loadImages();
  }, [images]);

  useEffect(() => {
    if (loadedImages.length === images.length) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => {
          setTransitioningIndex(prevIndex);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setTransitioningIndex(null);
          }, 50);
          return (prevIndex + 1) % imageItems.length;
        });
      }, 2000);

      return () => {
        clearInterval(interval);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [loadedImages, images.length, imageItems.length]);

  if (loadedImages.length !== images.length) {
    return (
      <LoadingContainer
        width={"100%"}
        justifyContent="center"
        alignItems="center"
      >
        Loading images...
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {imageItems.map((item, index) => (
        <ImageItem
          key={index}
          {...item}
          isActive={index === activeIndex}
          isTransitioning={index === transitioningIndex}
        >
          <StyledImage
            src={loadedImages[index % loadedImages.length]}
            alt={`Animated image ${index + 1}`}
          />
        </ImageItem>
      ))}
    </Container>
  );
};

export default AnimatedImageGrid;