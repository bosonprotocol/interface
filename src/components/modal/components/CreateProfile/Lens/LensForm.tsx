import { Form, Formik } from "formik";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
import CreateLensProfile from "./CreateLensProfile";
import LensFormFields from "./LensFormFields";
import {
  LensProfileType,
  lensProfileValidationSchema
} from "./validationSchema";
import ViewLensProfile from "./ViewLensProfile";

interface Props {
  onSubmit: (createValues: LensProfileType) => void;
  profile: Profile | null;
  formValues: LensProfileType | null | undefined;
  onBackClick: () => void;
  setStepBasedOnIndex: (index: number) => void;
}

export default function LensForm({
  onSubmit,
  profile,
  onBackClick,
  formValues,
  setStepBasedOnIndex
}: Props) {
  return (
    <Formik<LensProfileType>
      initialValues={
        formValues
          ? formValues
          : ({
              logo: [],
              coverPicture: [],
              name: "",
              handle: "",
              email: "",
              description: "",
              website: "",
              legalTradingName: ""
            } as LensProfileType)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSubmit={(values, _boson) => {
        if (profile) {
          onSubmit(values);
        } else {
          onSubmit({ ...values, website: preAppendHttps(values.website) });
        }
      }}
      validationSchema={lensProfileValidationSchema}
    >
      <Form>
        {profile ? (
          <ViewLensProfile
            profile={profile}
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
          >
            <LensFormFields disable={true} />
          </ViewLensProfile>
        ) : (
          <CreateLensProfile
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
          >
            <LensFormFields disable={false} />
          </CreateLensProfile>
        )}
      </Form>
    </Formik>
  );
}
