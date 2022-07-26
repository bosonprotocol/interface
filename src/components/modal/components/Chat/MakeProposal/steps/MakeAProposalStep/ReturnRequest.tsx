import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

export default function ReturnRequest() {
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <Typography fontSize="1.5rem" fontWeight="600">
        Return request
      </Typography>
      <Typography fontSize="1rem">Return and replace</Typography>
    </Grid>
  );
}
