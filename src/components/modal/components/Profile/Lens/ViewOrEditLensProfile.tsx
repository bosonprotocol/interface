import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useFormikContext } from "formik";
import { ReactNode, useEffect, useMemo } from "react";

import { CONFIG } from "../../../../../lib/config";
import {
  blobToBase64,
  dataURItoBlob,
  fetchImageAsBase64,
  isDataUri
} from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import {
  getImageMetadata,
  getLensImageUrl
} from "../../../../../lib/utils/images";
import { Spinner } from "../../../../loading/Spinner";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../../product/utils";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import { getMetadataEmail } from "../utils";
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
  profileInitialData?: CreateProfile;
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
  profileInitialData,
  seller,
  children,
  onBackClick,
  setStepBasedOnIndex,
  setFormChanged,
  isEdit,
  forceDirty
}: Props) {
  const {
    setValues,
    setTouched,
    values,
    isSubmitting,
    initialValues,
    touched
  } = useFormikContext<LensProfileType>();
  const profilePictureUrl =
    profileInitialData?.logo?.[0]?.src ??
    getLensImageUrl(getLensProfilePictureUrl(profile));
  const coverPictureMetadata = profileInitialData?.coverPicture?.[0];
  const coverPictureUrl =
    coverPictureMetadata?.src ??
    getLensImageUrl(getLensCoverPictureUrl(profile));
  const metadata = seller?.metadata;
  const { updateProps, store } = useModal();
  const hasMetadata = !!seller?.metadata;
  const contactPreference = seller?.metadata?.contactPreference;
  const valuesSameAsInitial = values === initialValues;
  const metadataEmail = getMetadataEmail(metadata);
  const changedFields: Record<keyof LensProfileType, boolean> = useMemo(() => {
    if (!profile || valuesSameAsInitial) {
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
      email: values.email !== metadataEmail,
      handle: false,
      legalTradingName: values.legalTradingName !== metadata?.legalTradingName,
      logo: false,
      name: false,
      website: values.website !== metadata?.website,
      contactPreference:
        !hasMetadata || values.contactPreference.value !== contactPreference
    };
    return changedValues;
  }, [
    profile,
    valuesSameAsInitial,
    values.email,
    values.legalTradingName,
    values.website,
    values.contactPreference.value,
    metadataEmail,
    metadata?.legalTradingName,
    metadata?.website,
    hasMetadata,
    contactPreference
  ]);
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
    try {
      Promise.all([
        isDataUri(profilePictureUrl)
          ? dataURItoBlob(profilePictureUrl)
          : fetchImageAsBase64(profilePictureUrl),
        isDataUri(coverPictureUrl)
          ? dataURItoBlob(coverPictureUrl)
          : fetchImageAsBase64(coverPictureUrl)
      ])
        .then(async ([profilePicture, coverPicture]) => {
          const profilePictureBlob =
            profilePicture instanceof Blob
              ? profilePicture
              : profilePicture.blob;
          const coverPictureBlob =
            coverPicture instanceof Blob ? coverPicture : coverPicture.blob;

          Promise.all([
            getImageMetadata(await blobToBase64(profilePictureBlob)),
            getImageMetadata(await blobToBase64(coverPictureBlob))
          ])
            .then(([profileMetadata, coverMetadata]) => {
              setValues({
                logo: profilePicture
                  ? [
                      {
                        src: profilePictureUrl,
                        type: profilePictureBlob.type,
                        size: profilePictureBlob.size,
                        height: profileMetadata.height,
                        width: profileMetadata.width
                      }
                    ]
                  : [],
                coverPicture: coverPicture
                  ? [
                      {
                        src: coverPictureUrl,
                        type: coverPictureBlob.type,
                        size: coverPictureBlob.size,
                        height: coverMetadata.height,
                        width: coverMetadata.width,
                        ...(!!coverPictureMetadata?.fit &&
                          !!coverPictureMetadata.position && {
                            fit: coverPictureMetadata.fit,
                            position: coverPictureMetadata.position
                          })
                      }
                    ]
                  : [],
                name: profile.name || "",
                handle:
                  profile.handle?.substring(
                    0,
                    profile.handle.lastIndexOf(
                      CONFIG.lens.lensHandleExtension
                    ) < 0
                      ? profile.handle.lastIndexOf(
                          CONFIG.lens.lensHandleExtension
                        )
                      : profile.handle.lastIndexOf(".")
                  ) || "",
                email:
                  metadata?.contactLinks?.find((cl) => cl.tag === "email")
                    ?.url ||
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
        })
        .catch((error) => {
          console.error(error);
          Sentry.captureException(error);
        });
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }, [
    profile,
    profilePictureUrl,
    coverPictureUrl,
    setValues,
    seller?.metadata?.contactPreference,
    metadata?.contactLinks,
    metadata?.website,
    metadata?.legalTradingName,
    coverPictureMetadata?.fit,
    coverPictureMetadata?.position
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
          {isEdit && (hasChanged || forceDirty || touched.coverPicture)
            ? "Save & continue"
            : "Next"}
          {isSubmitting && <Spinner size="20" />}
        </BosonButton>
      </Grid>
    </div>
  );
}
