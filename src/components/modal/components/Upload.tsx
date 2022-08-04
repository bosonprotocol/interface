import { Form, Formik, useField } from "formik";
import styled from "styled-components";

import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import Button from "../../ui/Button";
import { ModalProps } from "../ModalContext";
import { FormModel } from "./Chat/MakeProposal/MakeProposalFormModel";

type FileWithEncodedData = File & { encodedData: string };
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
          const promises = [];
          for (const file of files as FileWithEncodedData[]) {
            promises.push(
              new Promise<FileWithEncodedData>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = (e: ProgressEvent<FileReader>) => {
                  const encodedData = e.target?.result?.toString() || "";
                  file.encodedData = encodedData;
                  resolve(file);
                };
                reader.onerror = (error) => {
                  console.error(error);
                  reject(error);
                };
                reader.readAsDataURL(file);
              })
            );
          }
          try {
            const filesWithNullableEncodedData = await Promise.all(promises);
            const filesWithData = filesWithNullableEncodedData.filter(
              (file) => {
                return !!file.encodedData;
              }
            );

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
