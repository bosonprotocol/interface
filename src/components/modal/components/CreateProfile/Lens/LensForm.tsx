import { Form, Formik } from "formik";

import type { Profile } from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import CreateLensProfile from "./CreateLensProfile";
import LensFormFields from "./LensFormFields";
import { LensProfile, lensProfileValidationSchema } from "./validationSchema";
import ViewLensProfile from "./ViewLensProfile";

interface Props {
  onSubmit: (createValues: LensProfile) => void;
  profile: Profile | null;
  onBackClick: () => void;
}

export default function LensForm({ onSubmit, profile, onBackClick }: Props) {
  return (
    <Formik<LensProfile>
      initialValues={
        {
          logo: [],
          coverPicture: [],
          name: "",
          handle: "",
          email: "",
          description: "",
          website: "",
          legalTradingName: ""
        } as LensProfile
      }
      onSubmit={(values) => {
        onSubmit(values);
      }}
      validationSchema={lensProfileValidationSchema}
    >
      <Form>
        {profile ? (
          <ViewLensProfile profile={profile} onBackClick={onBackClick}>
            <LensFormFields disable={true} />
          </ViewLensProfile>
        ) : (
          <CreateLensProfile onBackClick={onBackClick}>
            <LensFormFields disable={false} />
          </CreateLensProfile>
        )}
      </Form>
    </Formik>
  );
}
