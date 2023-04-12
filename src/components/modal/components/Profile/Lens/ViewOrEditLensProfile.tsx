import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useFormikContext } from "formik";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo } from "react";

import { CONFIG } from "../../../../../lib/config";
import { fetchImageAsBase64 } from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { getLensImageUrl } from "../../../../../lib/utils/images";
import { Spinner } from "../../../../loading/Spinner";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import ProfileMultiSteps from "./ProfileMultiSteps";
import {
  getLensCoverPictureUrl,
  getLensEmail,
  getLensLegalTradingName,
  getLensProfilePictureUrl,
  getLensWebsite
} from "./utils";
import { LensProfileType } from "./validationSchema";

interface Props {
  profile: Profile;
  seller: subgraph.SellerFieldsFragment;
  children: ReactNode;
  onBackClick: () => void;
  setStepBasedOnIndex: (index: number) => void;
  setFormChanged: Dispatch<SetStateAction<boolean>>;
  isEditViewOnly: boolean;
}
const disabledFields = ["coverPicture", "handle", "logo"];
export default function ViewOrEditLensProfile({
  profile,
  seller,
  children,
  onBackClick,
  setStepBasedOnIndex,
  setFormChanged,
  isEditViewOnly
}: Props) {
  const { setValues, setTouched, initialValues, values, isSubmitting } =
    useFormikContext<LensProfileType>();
  const profilePictureUrl = getLensImageUrl(getLensProfilePictureUrl(profile));
  const coverPictureUrl = getLensImageUrl(getLensCoverPictureUrl(profile));

  const { updateProps, store } = useModal();
  const bosonSellerExists = !!seller;
  const changedFields = useMemo(() => {
    if (!profile || values === initialValues) {
      return {};
    }
    // all undefined fields are disabled fields also found in 'disabledFields' array
    const t = {
      coverPicture: undefined,
      description: values.description !== profile.bio,
      email: values.email !== getLensEmail(profile),
      handle: undefined,
      legalTradingName:
        values.legalTradingName !== getLensLegalTradingName(profile),
      logo: undefined,
      name: values.name !== profile.name,
      website: values.website !== getLensWebsite(profile)
    };
    return t;
  }, [values, profile, initialValues]);
  const hasChanged = !!Object.entries(changedFields).filter(
    ([key, value]) => !disabledFields.includes(key) && value
  ).length;
  useEffect(() => {
    setFormChanged(hasChanged);
  }, [setFormChanged, hasChanged]);
  useEffect(() => {
    if (changedFields) {
      setTouched(changedFields);
    }
  }, [setTouched, changedFields]);

  useEffect(() => {
    if (isEditViewOnly) {
      return;
    }
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect="select"
            activeStep={1}
            createOrViewRoyalties={bosonSellerExists ? "view" : "create"}
            key="ViewLensProfile"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditViewOnly]);

  useEffect(() => {
    Promise.all([
      fetchImageAsBase64(profilePictureUrl),
      fetchImageAsBase64(coverPictureUrl)
    ])
      .then(([profilePicture, coverPicture]) => {
        setValues({
          logo: profilePicture
            ? [
                {
                  src: profilePicture.base64,
                  type: profilePicture.blob.type,
                  size: profilePicture.blob.size
                }
              ]
            : [],
          coverPicture: coverPicture
            ? [
                {
                  src: coverPicture.base64,
                  type: coverPicture.blob.type,
                  size: coverPicture.blob.size
                }
              ]
            : [],
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
        });
      })
      .catch((error) => {
        console.error(error);
        Sentry.captureException(error);
      });
  }, [profile, profilePictureUrl, coverPictureUrl, setValues]);

  return (
    <div>
      {children}
      <Grid margin="2rem 0 0 0" justifyContent="flex-start" gap="2rem">
        {!isEditViewOnly && (
          <BosonButton
            variant="accentInverted"
            type="button"
            onClick={onBackClick}
          >
            Back
          </BosonButton>
        )}
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={isSubmitting}
        >
          {isEditViewOnly
            ? hasChanged
              ? "Save & close"
              : "Close"
            : hasChanged
            ? "Save & continue"
            : "Next"}
          {isSubmitting && <Spinner size="20" />}
        </BosonButton>
      </Grid>
    </div>
  );
}
