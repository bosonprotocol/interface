import "styled-components";

import { colors } from "./lib/styles/colors";

const theme = {
  colors: {
    light: {
      primary: colors.primary,
      secondary: colors.secondary,
      orange: colors.orange,
      white: "#ffffff"
    }
  },
  mobile: "768px",
  tablet: "1024px",
  fontSizes: {
    small: "12px",
    medium: "16px",
    large: "24px"
  }
};

export default theme;
