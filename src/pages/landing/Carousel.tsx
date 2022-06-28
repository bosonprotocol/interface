// inspired by https://3dtransforms.desandro.com/carousel

import { useRef, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import styled from "styled-components";

import OfferCard from "../../components/offer/OfferCard";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/offers";

const cellSize = 290;
const numCells = 8; // or number of offers
const tz = Math.round(cellSize / 2 / Math.tan(Math.PI / numCells));
const translateZValue = `${tz}px`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Scene = styled.div`
  width: ${cellSize}px;
  height: 420px;

  position: relative;
  perspective: 1000px;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: all 300ms ease-in;
  transform: translateZ(-${translateZValue});
`;

const nthChilds = new Array(numCells)
  .fill(0)
  .map((_, idx) => {
    return `
      :nth-child(${idx + 1}) {
        transform: rotateY(${
          (360 / numCells) * idx
        }deg) translateZ(${translateZValue});
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
  height: ${(props) => (props.$isCurrent ? "150px" : "120px")};
  left: 10px;
  top: 0;
  transition: all 300ms ease-in;

  ${nthChilds}
  > div {
    border-color: ${(props) =>
      props.$isPrevious
        ? "transparent"
        : props.$isNext
        ? "transparent"
        : "initial"};

    ${(props) => (props.$isPrevious || props.$isNext ? `opacity: 0.5;` : "")};

    img {
      height: 300px;
    }
    ::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: ${zIndex.Carousel};
      top: 0;
      background: ${(props) =>
        props.$isPrevious
          ? "linear-gradient(90deg,rgba(255,255,255,1) 50%,  transparent  100%);"
          : props.$isNext
          ? "linear-gradient(-90deg,rgba(255,255,255,1) 50%,  transparent  100%);"
          : "initial"};
      ${(props) =>
        props.$isPrevious
          ? `border-width: 0;
      border-right: 1px solid;
      border-image: ${colors.darkGrey}99 3 100%;
`
          : props.$isNext
          ? `border-width: 0;
      border-left: 1px solid;
      border-image: ${colors.darkGrey}99 3 100%;`
          : ""};
    }
    min-height: 300px;
  }
`;

const arrowSpace = "80px";

const PreviousButton = styled(IoChevronBackOutline)`
  position: absolute;
  left: ${arrowSpace};
  cursor: pointer;
  font-size: 30px;
  top: 50%;
`;

const NextButton = styled(PreviousButton)`
  transform: rotate(180deg);
  right: ${arrowSpace};
  left: initial;
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

  const numOffers = offers?.length || numCells;
  const onPreviousClick = () => {
    const newIndex = selectedIndex - 1 < 0 ? numOffers - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    rotateCarousel(newIndex);
  };
  const onNextClick = () => {
    const newIndex = selectedIndex + 1 > numOffers - 1 ? 0 : selectedIndex + 1;
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
    <Container>
      <Scene>
        <CarouselContainer ref={carouselRef} data-testid="carousel">
          {offers?.map((offer: Offer, idx: number) => {
            const previousCell =
              selectedIndex - 1 < 0
                ? numCells - 1 === idx
                : idx === selectedIndex - 1;
            const currentCell = idx === selectedIndex;
            const nextCell =
              idx === selectedIndex + 1 ||
              (selectedIndex + 1 === numCells && idx === 0);
            const visibleCell = previousCell || currentCell || nextCell;
            return (
              <CarouselCell
                key={idx}
                hidden={!visibleCell}
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
                />
              </CarouselCell>
            );
          })}
        </CarouselContainer>
      </Scene>
      <PreviousButton onClick={onPreviousClick}></PreviousButton>
      <NextButton onClick={onNextClick}></NextButton>
    </Container>
  );
}
