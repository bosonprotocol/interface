import { colors } from "lib/styles/colors";
import { getContrast } from "polished";

export const getTextColorWithContrast = ({
  backgroundColor,
  textColor,
  defaultLightTextColor = colors.white,
  defaultDarkTextColor = colors.black,
  contrastThreshold = 10
}: {
  backgroundColor: string;
  textColor: string;
  defaultLightTextColor?: string;
  defaultDarkTextColor?: string;
  contrastThreshold?: number;
}) => {
  const contrast = getContrast(backgroundColor, textColor);
  const contrastWithWhite = getContrast(backgroundColor, defaultLightTextColor);
  const contrastWithBlack = getContrast(backgroundColor, defaultDarkTextColor);
  return contrast > contrastThreshold
    ? textColor
    : contrastWithWhite > contrastWithBlack
    ? defaultLightTextColor
    : defaultDarkTextColor;
};
