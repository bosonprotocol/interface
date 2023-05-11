import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { ReactElement, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
import SimpleError from "../../../../error/SimpleError";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../../product/utils";
import { LensStep } from "./const";
import LensFormFields from "./LensFormFields";
import {
  LensProfileType,
  lensProfileValidationSchema,
  viewLensProfileValidationSchema
} from "./validationSchema";
import ViewOrEditLensProfile from "./ViewOrEditLensProfile";

interface Props {
  onSubmit: (
    createValues: LensProfileType,
    opts: {
      dirtyFields: Record<keyof LensProfileType, boolean>;
    }
  ) => Promise<void>;
  profile: Profile;
  seller: subgraph.SellerFieldsFragment | null;
  formValues: LensProfileType | null | undefined;
  onBackClick: () => void;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
  isEdit: boolean;
  switchButton: () => ReactElement;
  forceDirty?: boolean;
}

export default function LensForm({
  onSubmit,
  profile,
  seller,
  onBackClick,
  formValues,
  setStepBasedOnIndex,
  isEdit,
  switchButton: SwitchButton,
  forceDirty
}: Props) {
  const [changedFields, setFormChanged] = useState<
    Record<keyof LensProfileType, boolean>
  >({
    coverPicture: false,
    description: false,
    email: false,
    handle: false,
    legalTradingName: false,
    logo: false,
    name: false,
    website: false,
    contactPreference: false
  });
  const [error, setError] = useState<Error | null>(null);
  const defaultInitialValues: LensProfileType = {
    logo: [],
    coverPicture: [],
    name: "",
    handle: "",
    email: "",
    description: "",
    website: "",
    legalTradingName: "",
    contactPreference: OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
  };
  return (
    <Formik<LensProfileType>
      initialValues={formValues ? formValues : defaultInitialValues}
      onSubmit={async (values) => {
        try {
          setError(null);
          if (profile) {
            await onSubmit(values, { dirtyFields: changedFields });
          } else {
            await onSubmit(
              { ...values, website: preAppendHttps(values.website) },
              { dirtyFields: changedFields }
            );
          }
        } catch (err) {
          console.error(err);
          Sentry.captureException(error);
          setError(err as Error);
        }
      }}
      validationSchema={
        profile ? viewLensProfileValidationSchema : lensProfileValidationSchema
      }
    >
      {() => {
        return (
          <Form>
            <ViewOrEditLensProfile
              profile={profile}
              seller={seller}
              onBackClick={onBackClick}
              setStepBasedOnIndex={setStepBasedOnIndex}
              setFormChanged={setFormChanged}
              isEdit={isEdit}
              forceDirty={forceDirty}
            >
              <LensFormFields
                disableCover
                disableHandle
                disableLogo
                disableName
                disableDescription
              >
                {isEdit && <SwitchButton />}
              </LensFormFields>

              {error && <SimpleError />}
            </ViewOrEditLensProfile>
          </Form>
        );
      }}
    </Formik>
  );
}
