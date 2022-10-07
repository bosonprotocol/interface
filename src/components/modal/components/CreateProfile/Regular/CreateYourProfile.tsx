import { Form, Formik } from "formik";
import { useEffect } from "react";

import { CreateYourProfile as CreateYourProfileType } from "../../../../product/utils";
import { useModal } from "../../../useModal";
import CreateYourProfileForm from "./CreateYourProfileForm";
import { createYourProfileValidationSchema } from "./validationSchema";

interface Props {
  initial: CreateYourProfileType;
  onSubmit: (createValues: CreateYourProfileType) => void;
}

export default function CreateYourProfile({ initial, onSubmit }: Props) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        title: "Create Profile",
        headerComponent: null
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
