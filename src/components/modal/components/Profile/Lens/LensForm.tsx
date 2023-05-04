import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
import SimpleError from "../../../../error/SimpleError";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../../product/utils";
import Button from "../../../../ui/Button";
import { LensStep } from "./const";
import CreateLensProfile from "./CreateLensProfile";
import LensFormFields from "./LensFormFields";
import PassDownProps from "./PassDownProps";
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
      dirty: boolean;
    }
  ) => Promise<void>;
  profile: Profile | null;
  seller: subgraph.SellerFieldsFragment | null;
  formValues: LensProfileType | null | undefined;
  onBackClick: () => void;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
  isEditViewOnly: boolean;
  changeToRegularProfile: () => void;
  forceDirty?: boolean;
}

export default function LensForm({
  onSubmit,
  profile,
  seller,
  onBackClick,
  formValues,
  setStepBasedOnIndex,
  isEditViewOnly,
  changeToRegularProfile,
  forceDirty
}: Props) {
  const [formChanged, setFormChanged] = useState<boolean>(false);
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
  const UseRegularProfile = useCallback(() => {
    return (
      <Button
        onClick={changeToRegularProfile}
        theme="blankSecondary"
        style={{ marginTop: "1rem" }}
      >
        <small>Use regular profile instead</small>
      </Button>
    );
  }, [changeToRegularProfile]);
  return (
    <Formik<LensProfileType>
      initialValues={formValues ? formValues : defaultInitialValues}
      onSubmit={async (values) => {
        try {
          setError(null);
          if (profile) {
            await onSubmit(values, { dirty: formChanged });
          } else {
            await onSubmit(
              { ...values, website: preAppendHttps(values.website) },
              { dirty: formChanged }
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
      <Form>
        {profile ? (
          <ViewOrEditLensProfile
            profile={profile}
            seller={seller as subgraph.SellerFieldsFragment}
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
            setFormChanged={setFormChanged}
            isEditViewOnly={isEditViewOnly}
            forceDirty={forceDirty}
          >
            <LensFormFields
              disableCover={!isEditViewOnly}
              disableHandle
              disableLogo={!isEditViewOnly}
            />
            {isEditViewOnly && <UseRegularProfile />}
            {error && <SimpleError />}
          </ViewOrEditLensProfile>
        ) : (
          <CreateLensProfile
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
          >
            <PassDownProps>
              <LensFormFields
                logoSubtitle="Please choose an image that is no larger than 300KB to ensure it can be uploaded."
                coverSubtitle="Please choose an image that is no larger than 300KB to ensure it can be uploaded."
              />
              <UseRegularProfile />
              {error ? <SimpleError /> : <></>}
            </PassDownProps>
          </CreateLensProfile>
        )}
      </Form>
    </Formik>
  );
}
