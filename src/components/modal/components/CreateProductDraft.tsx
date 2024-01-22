import BosonButton from "../../ui/BosonButton";
import { Grid } from "../../ui/Grid";
import { Typography } from "../../ui/Typography";

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
      <Grid flexDirection="row" justifyContent="space-between" flexWrap="wrap">
        <BosonButton
          variant="primaryFill"
          onClick={chooseDraft}
          style={{ whiteSpace: "pre-line" }}
        >
          Edit draft
        </BosonButton>
        <BosonButton
          variant="accentInverted"
          onClick={chooseNew}
          style={{ whiteSpace: "pre-line" }}
        >
          Start Fresh
        </BosonButton>
      </Grid>
    </>
  );
}
