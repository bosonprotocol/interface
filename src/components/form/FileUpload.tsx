import { Image, Trash } from "phosphor-react";
import { useRef, useState } from "react";

import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import bytesToSize from "../../lib/utils/bytesToSize";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { Props } from "./Field";
import {
  FieldFileUpload,
  FieldFileUploadWrapper,
  FileUploadWrapper
} from "./Field.styles";

export default function FileUpload({
  accept = "image/*",
  disabled,
  multiple = false,
  trigger,
  placeholder,
  fileMaxSize,
  ...props
}: Props) {
  const FILE_MAX_SIZE = fileMaxSize || CONFIG.maxUploadSize;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChooseFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setPreview(null);
  };
  const handleRemoveFile = (index: number) => {
    const newArray = files.filter((i, k) => k !== index);
    setFiles(newArray);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const { files } = e.target;
    const filesArray = Object.values(files);
    for (const file of filesArray) {
      if (file.size > FILE_MAX_SIZE) {
        // TODO: change to notification
        console.error(
          `File size cannot exceed more than ${bytesToSize(FILE_MAX_SIZE)}`
        );
        return;
      }
    }
    setFiles(filesArray);
    if (!multiple && accept === "image/*") {
      const reader = new FileReader();
      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        const prev = e.target?.result?.toString() || null;
        setPreview(prev);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <FieldFileUploadWrapper>
      <FieldFileUpload
        {...props}
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        ref={(ref) => {
          inputRef.current = ref;
        }}
      />
      {trigger ? (
        <Button onClick={handleChooseFile} theme="primary">
          {trigger}
        </Button>
      ) : (
        <FileUploadWrapper
          choosen={files !== null}
          data-disabled={disabled}
          onClick={handleChooseFile}
        >
          {preview !== null && <img src={preview} />}
          <Image size={24} />
          {placeholder && (
            <Typography tag="p" style={{ marginBottom: "0" }}>
              {placeholder}
            </Typography>
          )}
        </FileUploadWrapper>
      )}
      {preview !== null && (
        <div onClick={handleRemoveAllFiles} data-remove>
          <Trash size={24} color={colors.white} />
        </div>
      )}
      {multiple &&
        files.map((file: File, index: number) => {
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
    </FieldFileUploadWrapper>
  );
}
