import { Form, Formik } from "formik";
import { useState } from "react";

import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../../product/utils";
import Button from "../../../../ui/Button";
import RegularProfileForm from "./RegularProfileForm";
import { createYourProfileSchema } from "./validationSchema";

interface Props {
  initial?: CreateProfile;
  onSubmit: (createValues: CreateProfile, dirty: boolean) => void;
  changeToLensProfile: () => void;
  isEdit: boolean;
}

export default function CreateYourRegularProfile({
  initial,
  onSubmit,
  changeToLensProfile
}: Props) {
  const [dirty, setDirty] = useState<boolean>(false);
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
        contactPreference: OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0],
        ...initial
      }}
      onSubmit={(values) => {
        onSubmit(values, dirty);
      }}
    >
      {({ dirty: formDirty }) => {
        if (formDirty !== dirty) {
          setDirty(formDirty);
        }
        return (
          <Form>
            <RegularProfileForm>
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
