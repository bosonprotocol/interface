import { useField } from "formik";
import { Info, UploadSimple } from "phosphor-react";

import Upload from "../../../../components/form/Upload/Upload";
import { FormModel } from "../../../../components/modal/components/Chat/MakeProposal/MakeProposalFormModel";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import bytesToSize from "../../../../lib/utils/bytesToSize";
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
        <Typography color={colors.darkGrey} $fontSize="0.75rem">
          File format:{" "}
          {SUPPORTED_FILE_FORMATS.map((f) => f?.split("/")?.[1]?.toUpperCase())}{" "}
          <br />
          Max. file size: {bytesToSize(MAX_FILE_SIZE)}
        </Typography>
      </Grid>
      <Upload
        name={FormModel.formFields.upload.name}
        multiple
        accept={SUPPORTED_FILE_FORMATS.join(",")}
        maxSize={MAX_FILE_SIZE}
        supportFormats={SUPPORTED_FILE_FORMATS}
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
