import * as Sentry from "@sentry/browser";
import { Form, Formik, FormikProps } from "formik";
import styled from "styled-components";
import * as Yup from "yup";

import {
  FileWithEncodedData,
  getFilesWithEncodedData
} from "../../../lib/utils/files";
import { validationOfFile } from "../../../pages/chat/components/UploadForm/const";
import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import BosonButton from "../../ui/BosonButton";
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

const validationSchema = Yup.object({
  [FormModel.formFields.upload.name]: validationOfFile({
    isOptional: false
  })
});

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
            Sentry.captureException(error);
          }
        } else {
          onUploadedFiles?.(files);
        }

        hideModal();
      }}
      initialValues={{
        upload: [] as File[]
      }}
      validationSchema={validationSchema}
      validateOnMount
    >
      {(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: FormikProps<any>
      ) => {
        const isFormValid = props.isValid;
        return (
          <Form>
            <UploadForm />
            <ButtonsSection>
              <BosonButton
                type="submit"
                variant="primaryFill"
                disabled={!isFormValid}
              >
                Submit
              </BosonButton>
            </ButtonsSection>
          </Form>
        );
      }}
    </Formik>
  );
}
