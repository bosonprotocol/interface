import { Image, Info, UploadSimple, X } from "phosphor-react";
import React, { useState } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useThisForm } from "../product/utils/useThisForm";
import Typography from "../ui/Typography";

const UploadContainer = styled.div`
  div:nth-of-type(1) {
    display: flex;
    align-items: center;
    svg {
      color: ${colors.darkGrey};
    }
  }
`;

const Button = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Plus Jakarta Sans";
  color: ${colors.secondary};
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-bottom: 0.125rem solid ${colors.lightGrey};
`;

const FileListElement = styled.div`
  width: 100%;
  height: 3.5rem;
  font-weight: 400;
  font-size: 1rem;
  color: ${colors.black};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.lightGrey};
  font-family: "Plus Jakarta Sans";
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: 0.75rem;
  [data-fileNameContainer] {
    svg {
      margin-right: 5px;
      margin-top: 0.125rem;
    }
  }
  button {
    background: none;
    padding: 0;
    margin: 0;
    border: none;
    margin-top: 0.25rem;
    svg {
      color: ${colors.darkGrey};
      fill: ${colors.darkGrey};
    }
  }
`;

const DocumentsUploader = (props: any) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const hiddenFileInput: any = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
    console.log("clicked");
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];
      setUploadedFiles([...uploadedFiles, fileUploaded]);
    }
  };

  const formValues = useThisForm();

  return (
    <>
      <UploadContainer>
        <Typography fontSize="1rem" color={colors.black} fontWeight="600">
          Upload documents <Info size={12} />
        </Typography>
        <Typography fontSize="0.75rem" color={colors.darkGrey} fontWeight="400">
          File format: PDF, PNG, JPG
        </Typography>
        <Typography fontSize="0.75rem" color={colors.darkGrey} fontWeight="400">
          Max. file size: 2MB
        </Typography>
        {formValues.values.file &&
          formValues.values.file.map((file: File) => {
            return (
              <FileListElement>
                <div data-fileNameContainer>
                  <Image size={22} />
                  {file.name}
                </div>
                <button
                  onClick={() => {
                    setUploadedFiles(
                      uploadedFiles.filter((f) => f.name !== file.name)
                    );
                  }}
                >
                  <X size={22} />
                </button>
              </FileListElement>
            );
          })}
        <Button onClick={handleClick}>
          Upload file &nbsp;&nbsp;
          <UploadSimple size={20} />
        </Button>
        <input
          type="file"
          ref={hiddenFileInput}
          style={{ display: "none" }}
          onChange={(event) => {
            if (event.currentTarget.files) {
              formValues.setFieldValue("file", [
                ...formValues.values.file,
                event.currentTarget.files[0]
              ]);
            }
          }}
        />
      </UploadContainer>
    </>
  );
};
export default DocumentsUploader;
