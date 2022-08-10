import { Warning } from "phosphor-react";

import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";
import type { ErrorProps } from "./types";

export default function Error({ display = false, message = "" }: ErrorProps) {
  if (!display) {
    return null;
  }
  return (
    <Typography
      tag="p"
      style={{
        color: colors.red,
        margin: "0.25rem",
        fontWeight: "600",
        fontSize: "0.75rem"
      }}
    >
      <Warning size={16} weight="bold" color={colors.red} />
      &nbsp;&nbsp;
      {message}
    </Typography>
  );
}
