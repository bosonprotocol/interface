import { Form, Formik } from "formik";

import { CONFIG } from "../../../../../lib/config";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
import CreateLensProfile from "./CreateLensProfile";
import LensFormFields from "./LensFormFields";
import {
  getLensCoverPictureUrl,
  getLensEmail,
  getLensLegalTradingName,
  getLensProfilePictureUrl,
  getLensWebsite
} from "./utils";
import {
  LensProfileType,
  lensProfileValidationSchema
} from "./validationSchema";
import ViewLensProfile from "./ViewLensProfile";

function useInitialState(profile: Profile | null) {
  if (profile) {
    const profilePicture = getLensProfilePictureUrl(profile);
    const coverPicture = getLensCoverPictureUrl(profile);
    const initialValues = {
      logo: profilePicture !== "" ? [{ src: profilePicture }] : [],
      coverPicture: coverPicture !== "" ? [{ src: coverPicture }] : [],
      name: profile.name || "",
      handle:
        profile.handle?.substring(
          0,
          profile.handle.lastIndexOf(CONFIG.lens.lensHandleExtension) < 0
            ? profile.handle.lastIndexOf(CONFIG.lens.lensHandleExtension)
            : profile.handle.lastIndexOf(".")
        ) || "",
      email: getLensEmail(profile) || "",
      description: profile.bio || "",
      website: getLensWebsite(profile) || "",
      legalTradingName: getLensLegalTradingName(profile) || ""
    };
    return initialValues as LensProfileType;
  } else {
    const baseInitialValues = {
      logo: [],
      coverPicture: [],
      name: "",
      handle: "",
      email: "",
      description: "",
      website: "",
      legalTradingName: ""
    };

    return baseInitialValues as LensProfileType;
  }
}

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
  // TODO: load initial values
  const initial = useInitialState(profile);

  return (
    <Formik<LensProfileType>
      initialValues={formValues ? formValues : initial}
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
