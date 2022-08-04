import { Form, Formik, useField } from "formik";
import styled from "styled-components";

import {
  FileWithEncodedData,
  getFilesWithEncodedData
} from "../../../lib/utils/files";
import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import Button from "../../ui/Button";
import { ModalProps } from "../ModalContext";
import { FormModel } from "./Chat/MakeProposal/MakeProposalFormModel";

interface Props {
  onUploadedFiles?: (files: File[]) => void;
  onUploadedFilesWithData?: (filesWithData: FileWithEncodedData[]) => void;
  onError?: (error: Error) => void;
  withEncodedData?: boolean;
  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const ButtonsForm = () => {
  const [field] = useField({
    name: FormModel.formFields.upload.name
  });
  return (
    <ButtonsSection>
      <Button type="submit" theme="secondary" disabled={!field.value?.length}>
        Submit
      </Button>
    </ButtonsSection>
  );
};
export default function Upload({
  hideModal,
  onUploadedFilesWithData,
  onError,
  onUploadedFiles,
  withEncodedData // TODO: if this is defined, then onUploadedFilesWithData should be defined
}: Props) {
  return (
    <Formik
      onSubmit={async (values) => {
        const files = values.upload;
        if (withEncodedData) {
          try {
            const filesWithData = await getFilesWithEncodedData(files);

            onUploadedFilesWithData?.(filesWithData);
          } catch (error) {
            onError?.(error as Error);
          }
        } else {
          onUploadedFiles?.(files);
        }

        hideModal();
      }}
      initialValues={{
        upload: [] as File[]
      }}
    >
      <Form>
        <UploadForm />
        <ButtonsForm />
      </Form>
    </Formik>
  );
}
