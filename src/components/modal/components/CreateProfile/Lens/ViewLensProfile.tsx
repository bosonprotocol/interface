import { useFormikContext } from "formik";
import { ReactNode, useEffect } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useGetIpfsImage } from "../../../../../lib/utils/hooks/useGetIpfsImage";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import { LensProfile } from "./validationSchema";

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = window.atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return blob;
}

interface Props {
  profile: Profile;
  children: ReactNode;
  onBackClick: () => void;
}

export default function ViewLensProfile({
  profile,
  children,
  onBackClick
}: Props) {
  const { setValues } = useFormikContext<LensProfile>();
  const profilePicture = profile?.picture?.original?.url || "";
  const coverPicture = profile?.coverPicture?.original?.url || "";
  const { imageSrc: profilePictureBase64, imageStatus } =
    useGetIpfsImage(profilePicture);
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        title: "Use existing profile"
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
      email:
        profile.attributes.find((attribute) => attribute.key === "email")
          ?.value || "",
      description: profile.bio || "",
      website:
        profile.attributes.find((attribute) => attribute.key === "website")
          ?.value || "",
      legalTradingName:
        profile.attributes.find(
          (attribute) => attribute.key === "legalTradingName"
        )?.value || ""
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
