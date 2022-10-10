import { Button } from "@bosonprotocol/react-kit";

import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  chooseNew: () => void;
  chooseDraft: () => void;
}

export default function CreateProductDraft({ chooseNew, chooseDraft }: Props) {
  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h5">We saved your unfinished product</Typography>
        <Typography tag="p">
          Do you wish to continue editing this product or start fresh?
        </Typography>
      </Grid>
      <Grid flexDirection="row" justifyContent="space-between">
        <Button variant="primaryFill" onClick={chooseDraft}>
          Edit draft
        </Button>
        <Button variant="accentInverted" onClick={chooseNew}>
          Start Fresh
        </Button>
      </Grid>
    </>
  );
}
