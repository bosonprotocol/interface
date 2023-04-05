import { Form, Formik } from "formik";

import { CreateYourProfile as CreateYourProfileType } from "../../../../product/utils";
import Button from "../../../../ui/Button";
import CreateYourProfileForm from "./CreateYourProfileForm";
import { createYourProfileValidationSchema } from "./validationSchema";

interface Props {
  initial: CreateYourProfileType;
  onSubmit: (createValues: CreateYourProfileType) => void;
  changeToLensProfile: () => void;
}

export default function CreateYourProfile({
  initial,
  onSubmit,
  changeToLensProfile
}: Props) {
  return (
    <Formik<CreateYourProfileType>
      validationSchema={createYourProfileValidationSchema}
      initialValues={initial}
      onSubmit={onSubmit}
    >
      <Form>
        <CreateYourProfileForm>
          <Button onClick={changeToLensProfile}>
            <small>Use Lens instead</small>
          </Button>
        </CreateYourProfileForm>
      </Form>
    </Formik>
  );
}
