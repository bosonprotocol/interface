import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { useState } from "react";

import SimpleError from "../../../../error/SimpleError";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../../product/utils";
import Button from "../../../../ui/Button";
import RegularProfileForm from "./RegularProfileForm";
import { createYourProfileSchema } from "./validationSchema";

interface Props {
  initial?: CreateProfile;
  onSubmit: (
    createValues: CreateProfile,
    dirty: boolean,
    resetDirty?: () => void
  ) => Promise<void>;
  changeToLensProfile: () => void;
  isEdit: boolean;
  forceDirty: boolean;
}

export default function CreateYourRegularProfile({
  initial,
  onSubmit,
  changeToLensProfile,
  isEdit,
  forceDirty
}: Props) {
  const [error, setError] = useState<Error | null>(null);
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
      onSubmit={async (values) => {
        try {
          setError(null);
          await onSubmit(values, dirty, () => setDirty(true));
        } catch (err) {
          console.error(err);
          Sentry.captureException(error);
          setError(err as Error);
        }
      }}
    >
      {({ dirty: formDirty }) => {
        if (formDirty !== dirty) {
          setDirty(formDirty);
        }
        return (
          <Form>
            <RegularProfileForm isEdit={isEdit} forceDirty={forceDirty}>
              <Button
                onClick={changeToLensProfile}
                theme="blankSecondary"
                style={{ marginTop: "1rem" }}
              >
                <small>Use Lens instead</small>
              </Button>
              {error ? <SimpleError /> : <></>}
            </RegularProfileForm>
          </Form>
        );
      }}
    </Formik>
  );
}
