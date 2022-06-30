// inspired by https://3dtransforms.desandro.com/carousel

import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import styled from "styled-components";

import OfferCard from "../../components/offer/OfferCard";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/offers";

const cellSize = 360;
const numCells = 8; // or number of max offers
const tz = Math.round(cellSize / 2 / Math.tan(Math.PI / numCells));
const translateZValue = `${tz}px`;

const VIEWER_DISTANCE = 1000;
const ITEM_WIDTH = cellSize;
const ITEM_PADDING = cellSize / 10;
const ANIMATION_TIME_MS = 500;

const Scene = styled.div`
  min-width: 50%;
  height: 40rem;

  perspective: ${VIEWER_DISTANCE}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    flex: 0 0 auto;
  }

  &:after,
  &:before {
    content: "";
    position: absolute;
    width: 75%;
    height: 100%;
    z-index: ${zIndex.Carousel};
    top: 0;
  }
  &:after {
    right: -50%;
    background: linear-gradient(
      -90deg,
      rgba(255, 255, 255, 1) 50%,
      transparent 100%
    );
  }
  &:before {
    left: -50%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 50%,
      transparent 100%
    );
  }
`;
const CarouselContainer = styled.div`
  margin: 0;

  width: ${ITEM_WIDTH}px;
  transform-style: preserve-3d;
  transition: transform ${ANIMATION_TIME_MS}ms;

  > div {
    width: 100%;
    box-sizing: border-box;
    padding: 0 calc(${ITEM_PADDING}px / 2);
  }
`;
const CarouselNav = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: ${zIndex.Carousel + 2};
`;

const nthChilds = new Array(numCells)
  .fill(0)
  .map((_, idx) => {
    return `
      :nth-child(${idx + 1}) {
        transform: rotateY(${
          (360 / numCells) * idx
        }deg) translateZ(${translateZValue}) translateY(50px);
      }
    `;
  })
  .join("");

const CarouselCell = styled.div<{
  $isNext: boolean;
  $isPrevious: boolean;
  $isCurrent: boolean;
}>`
  position: absolute;
  pointer-events: ${(props) => (props.$isCurrent ? "all" : "none")};
  left: 0;
  top: 0;
  transition: opacity ${ANIMATION_TIME_MS}ms;

  opacity: ${({ $isCurrent, $isPrevious, $isNext }) =>
    !$isCurrent && !$isPrevious && !$isNext ? "0" : "1"};
  > div {
    transition: transform ${ANIMATION_TIME_MS}ms;
  }

  ${nthChilds}
  ${(props) =>
    props.$isCurrent
      ? `
  > div {
    transform: scale(1.1);
  }
  `
      : ""};
`;

const PreviousButton = styled(RiArrowLeftSLine)`
  cursor: pointer;
  position: absolute;
  top: calc(50% - 48px / 2);
  left: 0;
  font-size: 3rem;
`;

const NextButton = styled(PreviousButton)`
  transform: rotate(180deg);
  left: initial;
  right: 0;
`;

const theta = 360 / numCells;
export default function Carousel() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const { data: offers } = useOffers({
    voided: false,
    valid: true,
    first: numCells
  });
  const uiOffers = useMemo(() => {
    if (offers) {
      const numOffersToAdd = numCells - offers.length;

      const uiOffers = [...offers];
      let offerIdx = 0;
      for (let index = 0; index < numOffersToAdd; index++) {
        const offerIdxToAdd = offerIdx % offers.length;
        uiOffers.push(offers[offerIdxToAdd]);

        offerIdx++;
      }
      return uiOffers;
    }
    return [];
  }, [offers]);

  useEffect(() => {
    rotateCarousel(selectedIndex);
  }, [selectedIndex]);

  const onPreviousClick = () => {
    const newIndex = selectedIndex - 1; // < 0 ? numCells - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
  };
  const onNextClick = () => {
    const newIndex = selectedIndex + 1; // > numCells - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
  };

  function rotateCarousel(newIndex: number) {
    const angle = theta * newIndex * -1;
    if (carouselRef.current) {
      const rotateFn = "rotateY";
      const cellWidth = carouselRef.current.offsetWidth;
      const cellSize = cellWidth;

      const radius = Math.round(cellSize / 2 / Math.tan(Math.PI / numCells));

      carouselRef.current.style.transform =
        "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
    }
  }

  return (
    <Scene>
      <CarouselContainer ref={carouselRef} data-testid="carousel">
        {uiOffers?.map((offer: Offer, idx: number) => {
          const clampedSelectedIndex =
            ((selectedIndex % numCells) + numCells) % numCells;
          const previousCell =
            clampedSelectedIndex - 1 < 0
              ? numCells - 1 === idx
              : idx === clampedSelectedIndex - 1;
          const currentCell = idx === clampedSelectedIndex;
          const nextCell =
            idx === clampedSelectedIndex + 1 ||
            (clampedSelectedIndex + 1 === numCells && idx === 0);
          return (
            <CarouselCell
              key={idx}
              $isCurrent={currentCell}
              $isPrevious={previousCell}
              $isNext={nextCell}
            >
              <OfferCard
                key={offer.id}
                offer={offer}
                showSeller
                dataTestId="offer"
                isPrivateProfile={false}
                isCarousel
              />
            </CarouselCell>
          );
        })}
      </CarouselContainer>
      <CarouselNav>
        <PreviousButton onClick={onPreviousClick}></PreviousButton>
        <NextButton onClick={onNextClick}></NextButton>
      </CarouselNav>
    </Scene>
  );
}
