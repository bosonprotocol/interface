import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useFormikContext } from "formik";
import { ReactNode, useEffect, useMemo } from "react";

import { CONFIG } from "../../../../../lib/config";
import {
  dataURItoBlob,
  fetchImageAsBase64,
  isDataUri
} from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { getLensImageUrl } from "../../../../../lib/utils/images";
import { Spinner } from "../../../../loading/Spinner";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../../product/utils";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import { LensStep } from "./const";
import LensProfileMultiSteps from "./LensProfileMultiSteps";
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
  seller: subgraph.SellerFieldsFragment | null;
  children: ReactNode;
  onBackClick: () => void;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
  setFormChanged: (changed: Record<keyof LensProfileType, boolean>) => void;
  isEdit: boolean;
  forceDirty?: boolean;
}
export default function ViewOrEditLensProfile({
  profile,
  seller,
  children,
  onBackClick,
  setStepBasedOnIndex,
  setFormChanged,
  isEdit,
  forceDirty
}: Props) {
  const { setValues, setTouched, initialValues, values, isSubmitting } =
    useFormikContext<LensProfileType>();
  const profilePictureUrl = getLensImageUrl(getLensProfilePictureUrl(profile));
  const coverPictureUrl = getLensImageUrl(getLensCoverPictureUrl(profile));
  const metadata = seller?.metadata;
  const { updateProps, store } = useModal();
  const changedFields: Record<keyof LensProfileType, boolean> = useMemo(() => {
    if (!profile || values === initialValues) {
      return {
        coverPicture: false,
        description: false,
        email: false,
        handle: false,
        legalTradingName: false,
        logo: false,
        name: false,
        website: false,
        contactPreference: false
      };
    }
    const changedValues: Record<keyof typeof values, boolean> = {
      // false values are disabled inputs that have to be edited in lens website
      coverPicture: false,
      description: false,
      email: values.email !== getLensEmail(profile),
      handle: false,
      legalTradingName:
        values.legalTradingName !== getLensLegalTradingName(profile),
      logo: false,
      name: false,
      website: values.website !== getLensWebsite(profile),
      contactPreference:
        !seller?.metadata ||
        values.contactPreference.value !== seller?.metadata?.contactPreference
    };
    return changedValues;
  }, [profile, values, initialValues, seller?.metadata]);
  const hasChanged = Object.values(changedFields).some((value) => value);
  useEffect(() => {
    setFormChanged(changedFields);
  }, [setFormChanged, changedFields]);
  useEffect(() => {
    if (changedFields) {
      setTouched({
        ...changedFields,
        contactPreference: {
          value: changedFields.contactPreference,
          label: changedFields.contactPreference
        }
      });
    }
  }, [setTouched, changedFields]);

  useEffect(() => {
    if (isEdit) {
      updateProps<"EDIT_PROFILE">({
        ...store,
        modalProps: {
          ...store.modalProps,
          headerComponent: (
            <LensProfileMultiSteps
              profileOption="edit"
              activeStep={LensStep.USE}
              createOrViewRoyalties="view"
              key="EditLensProfile"
              setStepBasedOnIndex={setStepBasedOnIndex}
            />
          )
        }
      });
      return;
    }
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <LensProfileMultiSteps
            profileOption={"create"}
            activeStep={LensStep.USE}
            createOrViewRoyalties={"create"}
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Promise.all([
      isDataUri(profilePictureUrl)
        ? dataURItoBlob(profilePictureUrl)
        : fetchImageAsBase64(profilePictureUrl),
      isDataUri(coverPictureUrl)
        ? dataURItoBlob(coverPictureUrl)
        : fetchImageAsBase64(coverPictureUrl)
    ])
      .then(([profilePicture, coverPicture]) => {
        const profilePictureBlob =
          profilePicture instanceof Blob ? profilePicture : profilePicture.blob;
        const coverPictureBlob =
          coverPicture instanceof Blob ? coverPicture : coverPicture.blob;
        setValues({
          logo: profilePicture
            ? [
                {
                  src: profilePictureUrl,
                  type: profilePictureBlob.type,
                  size: profilePictureBlob.size
                }
              ]
            : [],
          coverPicture: coverPicture
            ? [
                {
                  src: coverPictureUrl,
                  type: coverPictureBlob.type,
                  size: coverPictureBlob.size
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
          email:
            metadata?.contactLinks?.find((cl) => cl.tag === "email")?.url ||
            getLensEmail(profile) ||
            "",
          description: profile.bio || "",
          website: metadata?.website || getLensWebsite(profile) || "",
          legalTradingName:
            metadata?.legalTradingName ||
            getLensLegalTradingName(profile) ||
            "",
          contactPreference:
            OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.find(
              (obj) => obj.value === seller?.metadata?.contactPreference
            ) ?? OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
        });
      })
      .catch((error) => {
        console.error(error);
        Sentry.captureException(error);
      });
  }, [
    profile,
    profilePictureUrl,
    coverPictureUrl,
    setValues,
    seller?.metadata?.contactPreference,
    metadata?.contactLinks,
    metadata?.website,
    metadata?.legalTradingName
  ]);

  return (
    <div>
      {children}
      <Grid margin="2rem 0 0 0" justifyContent="flex-start" gap="2rem">
        {!isEdit && (
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
          {isEdit && (hasChanged || forceDirty) ? "Save & continue" : "Next"}
          {isSubmitting && <Spinner size="20" />}
        </BosonButton>
      </Grid>
    </div>
  );
}
