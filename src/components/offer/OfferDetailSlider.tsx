import { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";

import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Image from "../../components/ui/Image";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

interface IOfferDetailSlider {
  images: Array<string>;
}

const SliderWrapper = styled.div`
  position: relative;

  overflow: hidden;
  width: calc(100%);
  max-width: calc(100%);
  &:after {
    content: "";
    position: absolute;
    height: 100%;
    width: 4rem;
    z-index: ${zIndex.Carousel};
    top: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      -90deg,
      ${colors.lightGrey} 0%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

interface ISlider {
  current: number;
}

const Slider = styled.div<ISlider>`
  display: flex;
  gap: 2.5rem;
  transition: transform 500ms ease-in-out;
  transform: ${(props) => {
    return `translateX(calc(-${props.current * 20}rem - ${
      props.current !== 0 ? 2.5 * props.current : 0
    }rem))`;
  }};
  width: 100%;
  min-height: 20rem;
`;
const Slide = styled.div``;

const OfferDetailSlider: React.FC<IOfferDetailSlider> = ({ images }) => {
  const [current, setCurrent] = useState<number>(0);
  const count = images.length - 1;

  const handleSwipe = (next: boolean) => {
    if (next) {
      setCurrent(current === count ? 0 : current + 1);
    } else {
      setCurrent(current === 0 ? count : current - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(true),
    onSwipedRight: () => handleSwipe(false),
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: false
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <Grid>
        <Typography tag="h3" style={{ flex: "1 0 auto" }}>
          Detail images
        </Typography>
        <Grid justifyContent="flex-end">
          <Button theme="blank" onClick={() => handleSwipe(false)}>
            <AiOutlineLeft size={32} />
          </Button>
          <Button theme="blank" onClick={() => handleSwipe(true)}>
            <AiOutlineRight size={32} />
          </Button>
        </Grid>
      </Grid>
      <SliderWrapper {...handlers}>
        <Slider current={current}>
          {images?.map((image: string, index: number) => (
            <Slide key={`Slide_${index}`}>
              <Image
                src={image}
                style={{ minWidth: "20rem", paddingTop: "130%" }}
              />
            </Slide>
          ))}
        </Slider>
      </SliderWrapper>
    </div>
  );
};

export default OfferDetailSlider;
