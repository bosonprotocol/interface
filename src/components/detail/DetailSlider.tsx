import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

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

export default function DetailSlider({ images }: Props) {
  const ref = useRef();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}
