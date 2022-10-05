import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { LensProfileType } from "../../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { loadAndSetImage } from "../../../base64";
import { useIpfsStorage } from "../../useIpfsStorage";
import { useLensLogin } from "../authentication/useLensLogin";
import { Profile } from "../graphql/generated";
import useCreateLensProfile from "./useCreateLensProfile";
import useGetLensProfile from "./useGetLensProfile";
import useSetLensProfileMetadata from "./useSetLensProfileMetadata";

type Props = {
  values: LensProfileType;
  onCreatedProfile: (profile: Profile) => void;
  enabled: boolean;
};

export default function useCustomCreateLensProfile({
  values,
  onCreatedProfile,
  enabled: enableCreation
}: Props) {
  const [triggerLensProfileCreation, setTriggerLensProfileCreation] = useState<
    "start" | "fetch" | "triggered"
  >("start");
  const { address } = useAccount();
  const storage = useIpfsStorage();
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [coverPictureUrl, setCoverPictureUrl] = useState<string>("");
  const {
    data,
    refetch: loginWithLens,
    isLoading: lensLoginLoading
  } = useLensLogin({ address }, { enabled: false });
  const { accessToken } = data || {};

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (values.logo?.length) {
      const [image] = values.logo;
      (async () => {
        const cid = await storage.add(image);
        setProfileImageUrl("ipfs://" + cid);
      })();
    }
  }, [enableCreation, storage, values.logo]);
  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (values.coverPicture?.length) {
      const [image] = values.coverPicture;
      loadAndSetImage(image, setCoverPictureUrl);
    }
  }, [enableCreation, values.coverPicture]);

  const {
    data: createdProfileId,
    isFetched,
    refetch: createProfile,
    isLoading: isCreatingLensProfile
  } = useCreateLensProfile(
    {
      handle: values.handle || "",
      profilePictureUri: profileImageUrl
    },
    {
      accessToken: accessToken || "",
      enabled: false
    }
  );
  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (accessToken && triggerLensProfileCreation === "start") {
      setTriggerLensProfileCreation("fetch");
      createProfile();
    }
  }, [accessToken, triggerLensProfileCreation, createProfile, enableCreation]);
  const { data: profileData, refetch: getProfile } = useGetLensProfile(
    {
      handle: `${values.handle}.test`
    },
    {
      enabled: false
    }
  );
  const {
    data: profileMetadataData,
    refetch: setMetadata,
    isFetched: isMetadataFetched,
    isLoading: isSettingLensMetadata
  } = useSetLensProfileMetadata(
    {
      profileId: createdProfileId || "",
      name: values.name,
      bio: values.description,
      cover_picture: coverPictureUrl,
      attributes: [
        {
          traitType: "string",
          value: values.email,
          key: "email"
        },
        {
          traitType: "string",
          value: values.website,
          key: "website"
        },
        {
          traitType: "string",
          value: values.legalTradingName,
          key: "legalTradingName"
        }
      ],
      version: "1.0.0",
      metadata_id: window.crypto.randomUUID()
    },
    {
      accessToken: accessToken || "",
      enabled: false
    }
  );

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    const isCreatedProfile = isFetched && createdProfileId;
    if (isCreatedProfile) {
      setMetadata();
    }
  }, [createdProfileId, enableCreation, isFetched, setMetadata]);

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (isMetadataFetched && profileMetadataData) {
      getProfile();
    }
  }, [
    profileMetadataData,
    isMetadataFetched,
    getProfile,
    profileData,
    enableCreation
  ]);

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (isMetadataFetched && profileMetadataData && profileData) {
      onCreatedProfile(profileData);
    }
  }, [
    enableCreation,
    isMetadataFetched,
    onCreatedProfile,
    profileData,
    profileMetadataData
  ]);

  return {
    create: loginWithLens,
    getProfile,
    profileData,
    isLoading:
      lensLoginLoading || isCreatingLensProfile || isSettingLensMetadata
  };
}
