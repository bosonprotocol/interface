import { Form, Formik, useField } from "formik";
import styled from "styled-components";

import UploadForm from "../../../pages/chat/components/UploadForm/UploadForm";
import Button from "../../ui/Button";
import { ModalProps } from "../ModalContext";
import { FormModel } from "./Chat/MakeProposal/MakeProposalFormModel";

interface Props {
  onUploadedFiles: (files: File[]) => void;
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

export default function Upload({ hideModal, onUploadedFiles }: Props) {
  return (
    <Formik
      onSubmit={async (values) => {
        console.log("submit", values);
        onUploadedFiles(values.upload);
        hideModal();
      }}
      initialValues={{
        upload: []
      }}
    >
      <Form>
        <UploadForm />
        <ButtonsForm />
      </Form>
    </Formik>
  );
}
