import { useField } from "formik";
import { Info, UploadSimple } from "phosphor-react";

import Upload from "../../../../components/form/Upload/Upload";
import { FormModel } from "../../../../components/modal/components/Chat/MakeProposal/MakeProposalFormModel";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";

const numMB = 1;
const oneMBinBytes = numMB * 1024 * 1024;

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
          File format: PDF, PNG, JPG <br />
          Max. file size: {numMB}MB
        </Typography>
      </Grid>
      <Upload
        name={FormModel.formFields.upload.name}
        maxUploadSizeInBytes={oneMBinBytes}
        multiple
        accept="image/*, application/pdf"
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
