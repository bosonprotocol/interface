import Button from "../../ui/Button";
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
          Do you whish to continue editing this product or start fresh?
        </Typography>
      </Grid>
      <Grid flexDirection="row" justifyContent="space-between">
        <Button theme="primary" onClick={chooseDraft}>
          Edit draft
        </Button>
        <Button theme="primary" onClick={chooseNew}>
          Start Fresh
        </Button>
      </Grid>
    </>
  );
}
