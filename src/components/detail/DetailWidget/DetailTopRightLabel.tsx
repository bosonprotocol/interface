import { CSSProperties } from "react";

import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
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
  const { isLteXS } = useBreakpoints();
  return (
    <Grid
      flexDirection="column"
      $height="100%"
      alignItems="flex-end"
      justifyContent="center"
      style={{ marginTop: isLteXS ? "-7rem" : "0", ...style }}
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
