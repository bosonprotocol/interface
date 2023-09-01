import { WARNING_LEVEL } from "lib/constants/tokenSafety";
import { colors } from "lib/styles/colors";
import { opacify } from "polished";

export const useTokenWarningTextColor = (level: WARNING_LEVEL) => {
  switch (level) {
    case WARNING_LEVEL.MEDIUM:
      return "#EEB317";
    case WARNING_LEVEL.UNKNOWN:
      return "#FD766B";
    case WARNING_LEVEL.BLOCKED:
      return "#98A1C0";
  }
};

export const useTokenWarningColor = (level: WARNING_LEVEL) => {
  switch (level) {
    case WARNING_LEVEL.MEDIUM:
      return opacify(12, colors.black);
    case WARNING_LEVEL.UNKNOWN:
      return opacify(12, "#FD766B");
    case WARNING_LEVEL.BLOCKED:
      return opacify(12, colors.black);
  }
};
