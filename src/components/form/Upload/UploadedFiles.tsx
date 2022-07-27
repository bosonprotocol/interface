import { Trash } from "phosphor-react";

import bytesToSize from "../../../lib/utils/bytesToSize";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  files: File[];
  handleRemoveFile: (index: number) => void;
}
export default function UploadedFiles({ files, handleRemoveFile }: Props) {
  return (
    <>
      {files.map((file: File, index: number) => {
        return (
          <Grid key={`${file.name}_${index}`}>
            <Typography tag="p">
              {file.name}
              <small>{bytesToSize(file.size)}</small>
            </Typography>
            <Button onClick={() => handleRemoveFile(index)} theme="blank">
              <Trash size={24} />
            </Button>
          </Grid>
        );
      })}
    </>
  );
}
