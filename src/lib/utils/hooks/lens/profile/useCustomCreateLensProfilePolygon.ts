/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { LensProfileType } from "../../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { CONFIG } from "../../../../config";
import { useIpfsStorage } from "../../useIpfsStorage";
import { useLensLogin } from "../authentication/useLensLogin";
import { Profile } from "../graphql/generated";
import useClaimHandle from "./useClaimHandle";
import useGetLensProfile from "./useGetLensProfile";
import useSetLensProfileMetadata from "./useSetLensProfileMetadata";
import useSetProfileImageUri from "./useSetProfileImageUri";

type Props = {
  values: LensProfileType;
  onCreatedProfile: (profile: Profile) => void;
  enabled: boolean;
  onSetProfileLogoIpfsLink?: (ipfsLink: string) => void;
  onSetCoverLogoIpfsLink?: (ipfsLink: string) => void;
};

export default function useCustomCreateLensProfile({
  values,
  onCreatedProfile,
  enabled: enableCreation,
  onSetProfileLogoIpfsLink,
  onSetCoverLogoIpfsLink
}: Props) {
  const [triggerClaimHandle, setTriggerClaimHandle] = useState<
    "start" | "fetch" | "triggered"
  >("start");
  const { address } = useAccount();
  const storage = useIpfsStorage();
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [coverPictureUrl, setCoverPictureUrl] = useState<string>("");
  const {
    data,
    refetch: loginWithLens,
    isRefetching: isLoginRefetching,
    isLoading: isLoginLoading,
    isFetching: isLoginFetching,
    isSuccess: isLoginSuccess,
    isError: isLoginError
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
        const ipfsLink = "ipfs://" + cid;
        setProfileImageUrl(ipfsLink);
        onSetProfileLogoIpfsLink?.(ipfsLink);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableCreation, storage, values.logo]);
  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (values.coverPicture?.length) {
      const [image] = values.coverPicture;
      (async () => {
        const cid = await storage.add(image);
        const ipfsLink = "ipfs://" + cid;
        setCoverPictureUrl(ipfsLink);
        onSetCoverLogoIpfsLink?.(ipfsLink);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableCreation, storage, values.coverPicture]);

  const {
    data: createdProfileId,
    isFetched,
    refetch: claimHandle,
    isLoading: isCreateLoading,
    isRefetching: isCreateRefetching,
    isFetching: isCreateFetching,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
    status: createStatus
  } = useClaimHandle(
    {
      handle: values.handle || ""
      // profilePictureUri: profileImageUrl
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
    if (accessToken && triggerClaimHandle === "start") {
      setTriggerClaimHandle("fetch");
      claimHandle();
    }
  }, [accessToken, triggerClaimHandle, claimHandle, enableCreation]);
  const { data: profileData, refetch: getProfile } = useGetLensProfile(
    {
      handle: `${values.handle}${CONFIG.lens.lensHandleExtension}`
    },
    {
      enabled: false
    }
  );
  const { isSuccess: isUriSuccess, refetch: setUri } = useSetProfileImageUri(
    {
      profileId: createdProfileId,
      url: profileImageUrl
    },
    {
      accessToken: accessToken || "",
      enabled: false
    }
  );
  const {
    data: profileMetadataData,
    refetch: setMetadata,
    isLoading: isMetadataLoading,
    isError: isMetadataError,
    error: isSetLensProfileMetadataError,
    isSuccess: isMetadataSuccess
    // TODO: investigate why useSetLensProfileMetadata doesnt work well when used with useQuery
    // data: profileMetadataData,
    // refetch: setMetadata,
    // isLoading: isMetadataLoading,
    // isFetching: isMetadataFetching,
    // isRefetching: isMetadataRefetching,
    // isError: isMetadataError,
    // error: isSetLensProfileMetadataError,
    // isSuccess: isMetadataSuccess
    // isFetched: isMetadataFetched,
    // isRefetchError: isMetadataRefetchError,
    // isIdle: isMetadataIdle,
    // dataUpdatedAt: metadataDataUpdatedAt,
    // isFetchedAfterMount: isMetadataFetchedAfterMount,
    // errorUpdateCount: metadataErrorUpdateCount,
    // isLoadingError: isMetadataLoadingError,
    // isStale: isMetadataStale,
    // isPreviousData: isMetadataPreviousData,
    // errorUpdatedAt: metadataErrorUpdatedAt,
    // failureCount: metadataFailureCount,
    // isPlaceholderData: isMetadataPlaceholderData,
    // status: metadataStatus
  } = useSetLensProfileMetadata(
    {
      profileId: createdProfileId || "",
      name: values.name,
      bio: values.description,
      cover_picture: coverPictureUrl,
      attributes: [
        {
          traitType: "string",
          value: values.email || "",
          key: "email"
        },
        {
          traitType: "string",
          value: values.website || "",
          key: "website"
        },
        {
          traitType: "string",
          value: values.legalTradingName || "",
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
    const isClaimedHandle = isFetched && createdProfileId;
    if (isClaimedHandle) {
      setUri();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdProfileId, enableCreation, isFetched]);

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (isUriSuccess) {
      setMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableCreation, isUriSuccess]);

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (isMetadataSuccess && profileMetadataData) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileMetadataData,
    isMetadataSuccess,
    // getProfile,
    profileData,
    enableCreation
  ]);

  useEffect(() => {
    if (!enableCreation) {
      return;
    }
    if (isMetadataSuccess && profileMetadataData && profileData) {
      onCreatedProfile(profileData);
    }
  }, [
    enableCreation,
    isMetadataSuccess,
    onCreatedProfile,
    profileData,
    profileMetadataData
  ]);
  // console.log("inside useCustomCreateLens", {
  //   isLoginLoading,
  //   isLoginFetching,
  //   isLoginRefetching,
  //   isCreateLoading,
  //   isCreateFetching,
  //   isCreateRefetching,
  //   isMetadataFetching,
  //   isMetadataLoading,
  //   isMetadataRefetching,
  //   isLoginSuccess,
  //   isCreateSuccess,
  //   isMetadataSuccess,
  //   createStatus,
  //   metadataStatus,
  //   isMetadataFetched,
  //   isMetadataRefetchError,
  //   isMetadataIdle,
  //   metadataDataUpdatedAt,
  //   isMetadataFetchedAfterMount,
  //   metadataErrorUpdateCount,
  //   isMetadataLoadingError,
  //   isMetadataStale,
  //   isMetadataPreviousData,
  //   metadataErrorUpdatedAt,
  //   metadataFailureCount,
  //   isMetadataPlaceholderData
  // });
  return {
    create: loginWithLens,
    getProfile,
    profileData,
    isSuccess: isLoginSuccess && isCreateSuccess && isMetadataSuccess,
    isLoading:
      isLoginLoading ||
      isLoginFetching ||
      isLoginRefetching ||
      isCreateLoading ||
      isCreateFetching ||
      isCreateRefetching ||
      // isMetadataFetching ||
      isMetadataLoading,
    // isMetadataRefetching
    isError: isLoginError || isCreateError || isMetadataError,
    createError,
    isHandleTakenError: (createError as Error)?.message === "HANDLE_TAKEN",
    isSetLensProfileMetadataError
  };
}