import "styled-components";

import { BaseTagsInputProps, getThemes } from "@bosonprotocol/react-kit";
import { colors } from "lib/styles/colors";
export const themeVars = {
  roundness: "min",
  themeKey: "light"
} as const;
const theme = getThemes({ roundness: themeVars.roundness })[themeVars.themeKey];

export const inputTheme = {
  background: colors.greyLight,
  borderColor: colors.border,
  borderRadius: 0,
  color: undefined,
  placeholder: {
    color: undefined
  },
  focus: {
    caretColor: "initial"
  },
  hover: {
    borderColor: "var(--secondary)"
  },
  error: {
    borderColor: colors.orange,
    hover: {
      borderColor: colors.orange
    },
    focus: {
      borderColor: "var(--secondary)",
      caretColor: colors.orange
    },
    placeholder: {
      color: colors.orange
    }
  }
} satisfies BaseTagsInputProps["theme"];

export default theme;
