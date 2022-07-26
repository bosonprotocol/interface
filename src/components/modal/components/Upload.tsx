import { useState } from "react";
import styled from "styled-components";

import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import Button from "../../ui/Button";
import { ModalProps } from "../ModalContext";

interface Props {
  onFilesSelect: (files: File[]) => void;

  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function Upload({ onFilesSelect, hideModal }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  return (
    <>
      <UploadForm
        onFilesSelect={(files) => {
          setUploadedFiles(files);
        }}
      />
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => {
            hideModal();
            onFilesSelect(uploadedFiles);
          }}
          disabled={!uploadedFiles?.length}
        >
          Submit
        </Button>
      </ButtonsSection>
    </>
  );
}
