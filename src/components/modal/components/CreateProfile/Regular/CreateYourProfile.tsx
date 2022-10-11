import { Form, Formik } from "formik";

import { CreateYourProfile as CreateYourProfileType } from "../../../../product/utils";
import CreateYourProfileForm from "./CreateYourProfileForm";
import { createYourProfileValidationSchema } from "./validationSchema";

interface Props {
  initial: CreateYourProfileType;
  onSubmit: (createValues: CreateYourProfileType) => void;
}

export default function CreateYourProfile({ initial, onSubmit }: Props) {
  return (
    <Formik<CreateYourProfileType>
      validationSchema={createYourProfileValidationSchema}
      initialValues={initial}
      onSubmit={onSubmit}
    >
      <Form>
        <CreateYourProfileForm />
      </Form>
    </Formik>
  );
}
