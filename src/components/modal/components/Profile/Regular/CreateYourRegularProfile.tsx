import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { ReactElement, useState } from "react";

import SimpleError from "../../../../error/SimpleError";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../../product/utils";
import RegularProfileForm from "./RegularProfileForm";
import { createYourProfileSchema } from "./validationSchema";

interface Props {
  initial?: CreateProfile;
  onSubmit: (
    createValues: CreateProfile,
    dirty: boolean,
    resetDirty?: () => void,
    coverImageTouched?: boolean
  ) => Promise<void>;
  isEdit: boolean;
  forceDirty: boolean;
  switchButton: ReactElement;
}

export default function CreateYourRegularProfile({
  initial,
  onSubmit,
  switchButton,
  isEdit,
  forceDirty
}: Props) {
  const [error, setError] = useState<Error | null>(null);
  const [dirty, setDirty] = useState<boolean>(false);
  const [coverImageTouched, setCoverImageTouched] = useState<boolean>(false);
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
          await onSubmit(
            values,
            dirty,
            () => setDirty(true),
            coverImageTouched
          );
        } catch (err) {
          console.error(err);
          Sentry.captureException(error);
          setError(err as Error);
        }
      }}
    >
      {({ dirty: formDirty, touched }) => {
        if (formDirty !== dirty) {
          setDirty(formDirty);
        }
        if (touched.coverPicture !== coverImageTouched) {
          setCoverImageTouched(!!touched.coverPicture);
        }
        return (
          <Form>
            <RegularProfileForm
              isEdit={isEdit}
              forceDirty={forceDirty}
              switchButton={switchButton}
            >
              {error ? <SimpleError /> : <></>}
            </RegularProfileForm>
          </Form>
        );
      }}
    </Formik>
  );
}
