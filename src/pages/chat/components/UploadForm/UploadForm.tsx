import { useField } from "formik";
import { Info, UploadSimple } from "phosphor-react";

import Upload from "../../../../components/form/Upload/Upload";
import { FormModel } from "../../../../components/modal/components/Chat/MakeProposal/MakeProposalFormModel";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { MAX_FILE_SIZE, SUPPORTED_FILE_FORMATS } from "./const";

export default function UploadForm() {
  const [uploadField] = useField<File[]>(FormModel.formFields.upload.name);
  return (
    <>
      <Grid justifyContent="flex-start" gap="0.2rem">
        <Typography fontWeight="600">Upload documents</Typography>
        <Info size={20} />
      </Grid>
      <Grid margin="0.25rem 0 0.75rem 0">
        <Typography color={colors.darkGrey} fontSize="0.75rem">
          File format: PDF, PNG, JPG, GIF <br />
          Max. file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
        </Typography>
      </Grid>
      <Upload
        name={FormModel.formFields.upload.name}
        multiple
        accept={SUPPORTED_FILE_FORMATS.join(",")}
        trigger={
          <>
            Upload file <UploadSimple />
          </>
        }
        files={uploadField.value || []}
        wrapperProps={{ style: { width: "100%" } }}
      />
    </>
  );
}
