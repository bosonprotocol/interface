import { Form, Formik } from "formik";

import { CreateProfile } from "../../../../product/utils";
import Button from "../../../../ui/Button";
import RegularProfileForm from "./RegularProfileForm";
import { createYourProfileSchema } from "./validationSchema";

interface Props {
  initial?: CreateProfile;
  onSubmit: (createValues: CreateProfile) => void;
  changeToLensProfile: () => void;
  isEdit: boolean;
}

export default function CreateYourRegularProfile({
  initial,
  onSubmit,
  changeToLensProfile,
  isEdit
}: Props) {
  return (
    <Formik<CreateProfile>
      validationSchema={createYourProfileSchema}
      initialValues={{
        description: "",
        email: "",
        logo: [],
        coverPicture: [],
        name: "",
        website: "",
        legalTradingName: "",
        ...initial
      }}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <Form>
            <RegularProfileForm isEdit={isEdit}>
              <Button
                onClick={changeToLensProfile}
                theme="blankSecondary"
                style={{ marginTop: "1rem" }}
              >
                <small>Use Lens instead</small>
              </Button>
            </RegularProfileForm>
          </Form>
        );
      }}
    </Formik>
  );
}
