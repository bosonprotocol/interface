import { useFormikContext } from "formik";
import { ReactNode, useEffect } from "react";

import { dataURItoBlob } from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { useGetIpfsImage } from "../../../../../lib/utils/hooks/useGetIpfsImage";
import Button from "../../../../ui/Button";
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
  children: ReactNode;
  onBackClick: () => void;
  setStepBasedOnIndex: (index: number) => void;
}

export default function ViewLensProfile({
  profile,
  children,
  onBackClick,
  setStepBasedOnIndex
}: Props) {
  const { setValues } = useFormikContext<LensProfileType>();
  const profilePicture = getLensProfilePictureUrl(profile);
  const coverPicture = getLensCoverPictureUrl(profile);

  const { imageSrc: profilePictureBase64, imageStatus } =
    useGetIpfsImage(profilePicture);
  const { updateProps, store } = useModal();
  const alreadyHasRoyaltiesDefined = false; // TODO: seller.royalties;

  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect="select"
            activeStep={1}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="ViewLensProfile"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (imageStatus === "loading") {
      return;
    }
    const profileType = profilePictureBase64
      ? profilePictureBase64.split(";")[0].split(":")[1]
      : "";
    const profileFileType = profileType.includes("image")
      ? profileType
      : "image/jpg";
    setValues({
      logo: profilePictureBase64
        ? [
            new File([dataURItoBlob(profilePictureBase64)], "profilePicture", {
              type: profileFileType
            })
          ]
        : [],
      coverPicture: coverPicture
        ? [
            new File([dataURItoBlob(coverPicture)], "coverPicture", {
              type: coverPicture.split(";")[0].split(":")[1]
            })
          ]
        : [],
      name: profile.name || "",
      handle:
        profile.handle?.substring(
          0,
          profile.handle.lastIndexOf(".test") < 0
            ? profile.handle.lastIndexOf(".link")
            : profile.handle.lastIndexOf(".test")
        ) || "",
      email: getLensEmail(profile) || "",
      description: profile.bio || "",
      website: getLensWebsite(profile) || "",
      legalTradingName: getLensLegalTradingName(profile) || ""
    });
  }, [setValues, profile, profilePictureBase64, coverPicture, imageStatus]);
  return (
    <div>
      {children}
      <Grid justifyContent="flex-start" gap="2rem">
        <Button theme="bosonSecondary" type="button" onClick={onBackClick}>
          Back
        </Button>
        <Button theme="bosonPrimary" type="submit">
          Next
        </Button>
      </Grid>
    </div>
  );
}
