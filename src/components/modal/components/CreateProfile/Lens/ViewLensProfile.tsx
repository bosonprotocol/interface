import { subgraph } from "@bosonprotocol/react-kit";
import { useFormikContext } from "formik";
import { ReactNode, useEffect } from "react";

import { CONFIG } from "../../../../../lib/config";
import {
  dataURItoBlob,
  fetchImageAsBase64
} from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { getLensImageUrl } from "../../../../../lib/utils/images";
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
}

export default function ViewLensProfile({
  profile,
  seller,
  children,
  onBackClick,
  setStepBasedOnIndex
}: Props) {
  const { setValues } = useFormikContext<LensProfileType>();
  const profilePictureUrl = getLensImageUrl(getLensProfilePictureUrl(profile));
  const coverPictureUrl = getLensImageUrl(getLensCoverPictureUrl(profile));

  const { updateProps, store } = useModal();
  const bosonSellerExists = !!seller;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    Promise.all([
      fetchImageAsBase64(profilePictureUrl),
      fetchImageAsBase64(coverPictureUrl)
    ])
      .then(([profilePictureBase64, coverPictureBase64]) => {
        const profileType = profilePictureBase64
          ? profilePictureBase64.split(";")[0].split(":")[1]
          : "";
        const profileFileType = profileType.includes("image")
          ? profileType
          : "image/jpg";
        const coverType = coverPictureBase64
          ? coverPictureBase64.split(";")[0].split(":")[1]
          : "";
        const coverFileType = coverType.includes("image")
          ? coverType
          : "image/jpg";
        setValues({
          logo: profilePictureBase64
            ? [
                new File(
                  [dataURItoBlob(profilePictureBase64)],
                  "profilePicture",
                  {
                    type: profileFileType
                  }
                )
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
      })
      .catch((e) => console.error(e));
  }, [profile, profilePictureUrl, coverPictureUrl, setValues]);

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
