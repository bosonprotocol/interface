import { UploadSimple } from "phosphor-react";
import { useRef, useState } from "react";

import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";

interface Props {
  onFilesSelect: (files: File[]) => void;
  onFilesSelectError: ({ error }: { error: string }) => void;
}

export const FileUploader = ({ onFilesSelect, onFilesSelectError }: Props) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        onChange={(e) => {
          const { files } = e.target;
          if (!files) {
            return;
          }
          const filesArray = Object.values(files);
          for (const file of filesArray) {
            if (file.size > 2 * 1024 * 1024) {
              onFilesSelectError({
                error: "File size cannot exceed more than 2MB"
              });
              return;
            }
          }
          setUploadedFiles(filesArray);
          onFilesSelect(filesArray);
        }}
        multiple
        hidden
      />
      <Grid flexGrow="0" gap="1rem">
        <Grid flex="0 0 auto">
          <Button theme="primary" onClick={() => fileInput.current?.click()}>
            Upload file <UploadSimple />
          </Button>
        </Grid>
        <Grid flexDirection="column" flexGrow="0" alignItems="flex-start">
          {uploadedFiles.map((file) => {
            return <div key={`${file.name}-${file.size}`}>{file.name}</div>;
          })}
        </Grid>
      </Grid>
    </>
  );
};
