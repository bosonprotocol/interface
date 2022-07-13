import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import styled from "styled-components";

import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Image from "../../components/ui/Image";
import Typography from "../../components/ui/Typography";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

interface IOfferDetailSlider {
  images: Array<string>;
}

const GlideWrapper = styled.div`
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

const GlideSlide = styled.div`
  overflow: hidden;
`;

const SLIDER_OPTIONS = {
  type: "carousel" as const,
  autoplay: 6000,
  hoverpause: true,
  startAt: 0,
  gap: 20,
  perView: 3,
  breakpoints: {
    [breakpointNumbers.l]: {
      perView: 3
    },
    [breakpointNumbers.m]: {
      perView: 2
    },
    [breakpointNumbers.xs]: {
      perView: 1
    }
  }
};
type Direction = "<" | ">";
const OfferDetailSlider: React.FC<IOfferDetailSlider> = ({ images }) => {
  const ref = useRef();
  const [slider, setSlider] = useState<any>(null);

  useEffect(() => {
    if (ref.current && slider === null) {
      const glide = new Glide(ref.current, SLIDER_OPTIONS);
      glide.mount();
      setSlider(glide);
    }
    return () => (slider ? slider.destroy() : false);
  }, [ref, slider]);

  const handleSlider = useCallback(
    (direction: Direction) => {
      slider.go(direction);
    },
    [slider]
  );

  return (
    <div style={{ maxWidth: "100%" }}>
      <Grid>
        <Typography tag="h3" style={{ flex: "1 0 auto" }}>
          Detail images
        </Typography>
        <Grid justifyContent="flex-end">
          <Button theme="blank" onClick={() => handleSlider("<")}>
            <AiOutlineLeft size={32} />
          </Button>
          <Button theme="blank" onClick={() => handleSlider(">")}>
            <AiOutlineRight size={32} />
          </Button>
        </Grid>
      </Grid>
      <GlideWrapper
        className="glide"
        ref={(r: any) => {
          ref.current = r;
        }}
      >
        <div className="glide__track" data-glide-el="track">
          <div className="glide__slides">
            {images?.map((image: string, index: number) => (
              <GlideSlide className="glide__slide" key={`Slide_${index}`}>
                <Image
                  src={image}
                  style={{ minWidth: "20rem", paddingTop: "130%" }}
                  dataTestId="sliderImage"
                />
              </GlideSlide>
            ))}
          </div>
        </div>
      </GlideWrapper>
    </div>
  );
};

export default OfferDetailSlider;
