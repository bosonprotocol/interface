import { Image } from "phosphor-react";
import { useRef, useState } from "react";

import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";
import { Props } from "./Field";
import { FieldFileUpload, FileUploadWrapper } from "./Field.styles";

export default function FileUpload({ disabled, accept, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<FileList | null>(null);
  console.log(file);

  const handleFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFile(e.target.files);
  };

  return (
    <>
      <FileUploadWrapper
        choosen={file !== null}
        data-disabled={disabled}
        onClick={handleFile}
      >
        <Image size={24} />
        <FieldFileUpload
          {...props}
          hidden
          type="file"
          accept={accept || "image/*"}
          multiple={false}
          onChange={handleChange}
          ref={(ref) => {
            inputRef.current = ref;
          }}
        />
        {file !== null && (
          <Typography flexDirection="column" margin="0 1rem">
            Choosen file is
            <br />
            <b style={{ color: colors.secondary }}>
              {file[0]?.name || "Undefined"}
            </b>
          </Typography>
        )}
      </FileUploadWrapper>
    </>
  );
}
