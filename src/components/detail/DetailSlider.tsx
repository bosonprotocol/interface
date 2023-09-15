import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { colors } from "lib/styles/colors";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useEffect, useReducer, useRef } from "react";

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
  const ref = useRef<HTMLDivElement | null>(null);
  const [reinitializeGlide, reinitiliazeGlide] = useReducer(
    (state) => state + 1,
    0
  );

  useEffect(() => {
    if (images.length !== 0 && ref.current !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      glide = new Glide(ref.current as any, {
        ...SLIDER_OPTIONS
      });
      glide.mount();
    }

    return () => {
      glide?.destroy();
    };
  }, [ref, images, reinitializeGlide]);

  const handleSlider = (direction: Direction) => {
    glide?.go(direction);
  };

  const afterBackground = useCSSVariable("--secondary") || colors.lightGrey;

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
        ref={ref}
        $afterBackground={afterBackground}
      >
        <div className="glide__track" data-glide-el="track">
          <div className="glide__slides">
            {images?.map((image: string, index: number) => (
              <GlideSlide className="glide__slide" key={`Slide_${index}`}>
                <Image
                  src={image}
                  style={{ paddingTop: "130%" }}
                  dataTestId="sliderImage"
                  optimizationOpts={{
                    height: 500
                  }}
                  onSetStatus={(status) => {
                    if (status === "success") {
                      // we need to reinitilize the glide in case an image doesnt load correctly the first
                      // time (before trying the second time with a different gateway),
                      // so that the loading state is not shown indefinitely
                      reinitiliazeGlide();
                    }
                  }}
                />
              </GlideSlide>
            ))}
          </div>
        </div>
      </GlideWrapper>
    </div>
  );
}
