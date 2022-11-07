import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useEffect, useRef } from "react";

import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Image from "../../components/ui/Image";
import Typography from "../../components/ui/Typography";
import { SLIDER_OPTIONS } from "./const";
import { GlideSlide, GlideWrapper } from "./Detail.style";

type Direction = "<" | ">";
interface Props {
  images: Array<string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let glide: any = null;

export default function DetailSlider({ images }: Props) {
  const ref = useRef();

  useEffect(() => {
    if (images.length !== 0 && ref.current) {
      glide = new Glide(ref.current, {
        ...SLIDER_OPTIONS
      });
      glide.mount();
    }
  }, [ref, images]);

  const handleSlider = (direction: Direction) => {
    glide.go(direction);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <Grid>
        <Typography tag="h3" style={{ flex: "1 0 auto" }}>
          Detail images
        </Typography>
        <Grid justifyContent="flex-end">
          <Button theme="blank" onClick={() => handleSlider("<")}>
            <CaretLeft size={32} />
          </Button>
          <Button theme="blank" onClick={() => handleSlider(">")}>
            <CaretRight size={32} />
          </Button>
        </Grid>
      </Grid>
      <GlideWrapper
        className="glide"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                  style={{ paddingTop: "130%" }}
                  dataTestId="sliderImage"
                />
              </GlideSlide>
            ))}
          </div>
        </div>
      </GlideWrapper>
    </div>
  );
}
