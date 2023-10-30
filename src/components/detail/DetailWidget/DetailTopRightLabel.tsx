import { CSSProperties } from "react";

import { colors } from "../../../lib/styles/colors";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  children?: string | React.ReactNode;
  swapButton: React.ReactNode | null;
  style?: CSSProperties;
  typographyStyle?: CSSProperties;
}
export default function DetailTopRightLabel({
  children,
  swapButton,
  style,
  typographyStyle
}: Props) {
  return (
    <Grid
      flexDirection="column"
      $height="100%"
      alignItems="flex-end"
      justifyContent="center"
      style={style}
    >
      <Typography
        tag="p"
        style={{ color: colors.orange, margin: 0, ...typographyStyle }}
      >
        {children}
      </Typography>
      {swapButton}
    </Grid>
  );
}
