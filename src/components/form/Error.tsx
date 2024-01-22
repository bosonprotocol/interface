import { colors } from "../../lib/styles/colors";
import { Typography } from "../ui/Typography";
import type { ErrorProps } from "./types";

export default function Error({ display = false, message = "" }: ErrorProps) {
  if (!display) {
    return null;
  }
  return (
    <Typography
      tag="p"
      color={colors.orange}
      margin="0.25rem"
      fontWeight="600"
      fontSize="0.75rem"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {message}
    </Typography>
  );
}
