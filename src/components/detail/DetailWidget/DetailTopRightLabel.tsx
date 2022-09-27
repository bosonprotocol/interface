import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  children?: string | React.ReactNode;
}
export default function DetailTopRightLabel({ children }: Props) {
  const { isLteXS } = useBreakpoints();
  return (
    <Grid
      $height="100%"
      alignItems="center"
      justifyContent="flex-end"
      style={{ marginTop: isLteXS ? "-7rem" : "0" }}
    >
      <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
        {children}
      </Typography>
    </Grid>
  );
}
