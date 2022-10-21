import { useFormikContext } from "formik";
import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../../lib/config";
import { dataURItoBlob } from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { useGetIpfsImage } from "../../../../../lib/utils/hooks/useGetIpfsImage";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
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

  const { imageSrc: profilePictureBase64, imageStatus: profilePictureStatus } =
    useGetIpfsImage(profilePicture);
  const { imageSrc: coverPictureBase64, imageStatus: coverPictureStatus } =
    useGetIpfsImage(coverPicture);
  const { updateProps, store } = useModal();
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const seller = admins?.[0];
  const alreadyHasRoyaltiesDefined = !!seller?.royaltyPercentage;

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
    if (
      profilePictureStatus === "loading" ||
      coverPictureStatus === "loading"
    ) {
      return;
    }
    const profileType = profilePictureBase64
      ? profilePictureBase64.split(";")[0].split(":")[1]
      : "";
    const profileFileType = profileType.includes("image")
      ? profileType
      : "image/jpg";
    const coverType = coverPictureBase64
      ? coverPictureBase64.split(";")[0].split(":")[1]
      : "";
    const coverFileType = coverType.includes("image") ? coverType : "image/jpg";
    setValues({
      logo: profilePictureBase64
        ? [
            new File([dataURItoBlob(profilePictureBase64)], "profilePicture", {
              type: profileFileType
            })
          ]
        : [],
      coverPicture: coverPictureBase64
        ? [
            new File([dataURItoBlob(coverPictureBase64)], "coverPicture", {
              type: coverFileType
            })
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
  }, [
    coverPictureBase64,
    coverPictureStatus,
    profile,
    profilePictureBase64,
    profilePictureStatus,
    setValues
  ]);
  return (
    <div>
      {children}
      <Grid justifyContent="flex-start" gap="2rem">
        <BosonButton
          variant="accentInverted"
          type="button"
          onClick={onBackClick}
        >
          Back
        </BosonButton>
        <BosonButton variant="primaryFill" type="submit">
          Next
        </BosonButton>
      </Grid>
    </div>
  );
}
