import { Info } from "phosphor-react";

import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { FileUploader } from "./FileUploader";

type Props = Parameters<typeof FileUploader>[0];

export default function Upload({ onFilesSelect, onFilesSelectError }: Props) {
  return (
    <>
      <Grid justifyContent="flex-start" gap="0.2rem">
        <Typography fontWeight="600">Upload documents</Typography>
        <Info size={20} />
      </Grid>
      <Grid margin="0.25rem 0 0.75rem 0">
        <Typography color={colors.darkGrey} fontSize="0.75rem">
          File format: PDF, PNG, JPG <br />
          Max. file size: 2MB
        </Typography>
      </Grid>
      <FileUploader
        onFilesSelect={onFilesSelect}
        onFilesSelectError={onFilesSelectError}
      />
    </>
  );
}
