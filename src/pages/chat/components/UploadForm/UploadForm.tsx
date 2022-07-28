import { useField } from "formik";
import { Info, UploadSimple } from "phosphor-react";

import UploadComponent from "../../../../components/form/Upload/Upload";
import { FormModel } from "../../../../components/modal/components/Chat/MakeProposal/MakeProposalFormModel";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";

export default function Upload() {
  const [uploadField] = useField(FormModel.formFields.upload.name);
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
      <UploadComponent
        name={FormModel.formFields.upload.name}
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
