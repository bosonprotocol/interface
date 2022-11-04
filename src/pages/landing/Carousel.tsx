// inspired by https://3dtransforms.desandro.com/carousel

import { CaretLeft, CaretRight } from "phosphor-react";
import { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

import ProductCard from "../../components/productCard/ProductCard";
import { breakpoint } from "../../lib/styles/breakpoint";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import useProductsByFilteredOffers from "../../lib/utils/hooks/product/useProductsByFilteredOffers";
import extractUniqueRandomProducts from "../../lib/utils/product/extractUniqueRandomProducts";
import { ExtendedOffer } from "../explore/WithAllOffers";

const cellSize = 300;
const numCells = 8; // or number of max offers
const tz = Math.round(cellSize / 2 / Math.tan(Math.PI / numCells));
const translateZValue = `${tz}px`;

const VIEWER_DISTANCE = 1000;
const ITEM_WIDTH = cellSize;
const ITEM_PADDING = cellSize / 10;
const ANIMATION_TIME_MS = 500;

const Scene = styled.div`
  transform: scale(0.8);
  min-width: 150%;
  min-height: 540px;
  margin-top: -4rem;

  ${breakpoint.xs} {
    margin-top: 0;
    overflow: hidden;
    min-height: 650px;
    min-width: 120%;
    transform: scale(1);
  }
  ${breakpoint.xs} {
    min-width: 100%;
  }
  ${breakpoint.m} {
    min-width: 60%;
  }
  ${breakpoint.l} {
    min-width: 50%;
  }
  ${breakpoint.xl} {
    min-width: 50%;
  }

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
    width: 20vw;
    ${breakpoint.s} {
      width: 15vw;
    }
    ${breakpoint.l} {
      width: 12vw;
    }
    height: 100%;
    z-index: ${zIndex.Carousel};
    top: 0;
  }
  &:after {
    right: -1vw;
    ${breakpoint.m} {
      right: -5vw;
    }
    background: linear-gradient(
      -90deg,
      var(--primaryBgColor) 50%,
      transparent 100%
    );
  }
  &:before {
    left: -1vw;
    ${breakpoint.m} {
      left: -5vw;
    }
    background: linear-gradient(
      90deg,
      var(--primaryBgColor) 50%,
      transparent 100%
    );
  }
`;
const CarouselContainer = styled.div`
  margin: 0;

  width: ${ITEM_WIDTH}px;
  transform-style: preserve-3d;
  transition: transform ${ANIMATION_TIME_MS}ms;

  transform: translateZ(-${translateZValue}) rotateY(0deg);

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
  width: 90%;
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
    &:hover {
      box-shadow: none;
    }
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
  [data-testid="offer"] {
    box-shadow: none;
  }
`;

const navButtons = css`
  cursor: pointer;
  position: absolute;
  top: calc(50% - 48px / 2);
`;

const PreviousButton = styled(CaretLeft)`
  ${navButtons}
  left: 1rem;
  ${breakpoint.s} {
    left: 0;
  }
`;

const NextButton = styled(CaretRight)`
  ${navButtons}
  right: 1rem;
  ${breakpoint.s} {
    right: 0;
  }
`;

const theta = 360 / numCells;
export default function Carousel() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const { products } = useProductsByFilteredOffers({
    voided: false,
    valid: true,
    first: numCells,
    quantityAvailable_gte: 1
  });

  const uiOffers = useMemo(() => {
    if (products?.length) {
      let uiOffers: ExtendedOffer[] = [];
      try {
        uiOffers = extractUniqueRandomProducts({
          products,
          quantity: numCells
        });
      } catch (error) {
        console.error(error);
      }
      const numOffersToAdd = numCells - uiOffers.length;
      let offerIdx = 0;
      // if we need more products than what we got from the request, we add some duplicate products
      for (let index = 0; index < numOffersToAdd; index++) {
        const offerIdxToAdd = offerIdx % products.length;
        uiOffers.push(products[offerIdxToAdd]);

        offerIdx++;
      }
      return uiOffers;
    }
    return [];
  }, [products]);

  const onPreviousClick = () => {
    const newIndex = selectedIndex - 1;
    setSelectedIndex(newIndex);
    rotateCarousel(newIndex);
  };
  const onNextClick = () => {
    const newIndex = selectedIndex + 1;
    setSelectedIndex(newIndex);
    rotateCarousel(newIndex);
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
              {...(currentCell && { "data-current": true })}
            >
              <ProductCard
                key={offer.id}
                offer={offer}
                dataTestId="offer"
                isHoverDisabled={true}
              />
            </CarouselCell>
          );
        })}
      </CarouselContainer>
      <CarouselNav>
        <PreviousButton
          data-testid="carousel-previous"
          onClick={onPreviousClick}
        ></PreviousButton>
        <NextButton
          data-testid="carousel-next"
          onClick={onNextClick}
        ></NextButton>
      </CarouselNav>
    </Scene>
  );
}
