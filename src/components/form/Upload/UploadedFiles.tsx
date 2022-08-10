import UploadedFile from "./UploadedFile";

interface Props {
  files: File[];
  handleRemoveFile: (index: number) => void;
}
export default function UploadedFiles({ files, handleRemoveFile }: Props) {
  return (
    <>
      {files.map((file: File, index: number) => {
        return (
          <UploadedFile
            key={`${file.name}_${index}`}
            fileName={file.name}
            fileSize={file.size}
            color="white"
            handleRemoveFile={() => handleRemoveFile(index)}
            showSize
          />
        );
      })}
    </>
  );
}
