import { colors } from "lib/styles/colors";
import { getContrast } from "polished";

export const getColor1OverColor2WithContrast = ({
  color2,
  color1,
  defaultLightColor1 = colors.white,
  defaultDarkColor1 = colors.black,
  contrastThreshold = 10
}: {
  color2: string;
  color1: string;
  defaultLightColor1?: string;
  defaultDarkColor1?: string;
  contrastThreshold?: number;
}) => {
  if (!color2 || !color1) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  const contrast = getContrast(color2, color1);
  const contrastWithWhite = getContrast(color2, defaultLightColor1);
  const contrastWithBlack = getContrast(color2, defaultDarkColor1);
  return contrast > contrastThreshold
    ? color1
    : contrastWithWhite > contrastWithBlack
      ? defaultLightColor1
      : defaultDarkColor1;
};
