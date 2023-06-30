import { UploadFileType } from "./types";
import UploadedFile from "./UploadedFile";

interface Props {
  files: UploadFileType[];
  handleRemoveFile: (index: number) => void;
}
export default function UploadedFiles({ files, handleRemoveFile }: Props) {
  return (
    <>
      {files.map((file: UploadFileType, index: number) => {
        return (
          <UploadedFile
            key={`${file?.name || ""}_${index}`}
            fileName={file?.name || `file_${index}`}
            fileSize={Number(file?.size || 0)}
            color="white"
            handleRemoveFile={() => handleRemoveFile(index)}
            showSize
          />
        );
      })}
    </>
  );
}
