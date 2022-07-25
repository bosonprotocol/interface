import { useState } from "react";
import styled from "styled-components";

import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import Button from "../../ui/Button";
import { ModalProps } from "../ModalContext";

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function Upload({ hideModal }: Props) {
  const [hasFiles, setHasFiles] = useState<boolean>(false);
  return (
    <>
      <UploadForm
        onFilesSelect={() => setHasFiles(true)}
        onFilesSelectError={() => setHasFiles(false)}
      />
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => hideModal()}
          disabled={!hasFiles}
        >
          Submit
        </Button>
      </ButtonsSection>
    </>
  );
}
