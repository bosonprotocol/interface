import { useField, useFormikContext } from "formik";
import { ReactNode, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useLensLogin } from "../../../../../lib/utils/hooks/lens/authentication/useLensLogin";
import useCreateLensProfile from "../../../../../lib/utils/hooks/lens/profile/useCreateLensProfile";
import useGetLensProfile from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfile";
import useSetLensProfileMetadata from "../../../../../lib/utils/hooks/lens/profile/useSetLensProfileMetadata";
import { useIpfsStorage } from "../../../../../lib/utils/hooks/useIpfsStorage";
import { ProductButtonGroup } from "../../../../product/Product.styles";
import Button from "../../../../ui/Button";
import { LensProfile } from "./validationSchema";

const loadAndSetImage = (
  image: File,
  callback: (base64Uri: string) => unknown
) => {
  const reader = new FileReader();
  reader.onloadend = (e: ProgressEvent<FileReader>) => {
    const prev = e.target?.result?.toString() || "";
    callback(prev);
  };
  reader.readAsDataURL(image);
};

interface Props {
  children: ReactNode;
}

export default function CreateLensProfile({ children }: Props) {
  const [triggerLensProfileCreation, setTriggerLensProfileCreation] = useState<
    "start" | "fetch" | "triggered"
  >("start");
  const { values, isValid, submitForm } = useFormikContext<LensProfile>();
  const { address } = useAccount();
  const storage = useIpfsStorage();
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [coverPictureUrl, setCoverPictureUrl] = useState<string>("");
  const { data, refetch: loginWithLens } = useLensLogin(
    { address },
    { enabled: false }
  );
  const { accessToken } = data || {};
  useEffect(() => {
    if (values.logo?.length) {
      const [image] = values.logo;
      loadAndSetImage(image, async (imgUrl) => {
        const cid = await storage.add(imgUrl);
        setProfileImageUrl("ipfs://" + cid);
      });
    }
  }, [storage, values.logo]);
  useEffect(() => {
    if (values.coverPicture?.length) {
      const [image] = values.coverPicture;
      loadAndSetImage(image, setCoverPictureUrl);
    }
  }, [values.coverPicture]);

  console.log({ triggerLensProfileCreation });
  const {
    data: createdProfileId,
    isFetched,
    refetch: createProfile
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
    if (accessToken && triggerLensProfileCreation === "start") {
      setTriggerLensProfileCreation("fetch");
      createProfile();
    }
  }, [accessToken, triggerLensProfileCreation, createProfile]);
  const [field, meta] = useField("handle");
  const { data: profileData, refetch: getProfile } = useGetLensProfile(
    {
      handle: `${field.value}.test`
    },
    {
      enabled: false
    }
  );
  // console.log({ createdProfileId, profileData });
  const {
    data: profileMetadataData,
    refetch: setMetadata,
    isFetched: isMetadataFetched
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
    const isCreatedProfile = isFetched && createdProfileId;
    if (isCreatedProfile) {
      setMetadata();
    }
  }, [createdProfileId, isFetched, setMetadata]);

  useEffect(() => {
    if (isMetadataFetched && profileMetadataData) {
      submitForm();
    }
  }, [profileMetadataData, isMetadataFetched, submitForm]);

  const { setStatus, status } = useFormikContext<LensProfile>();

  useEffect(() => {
    const checkHandle = field.value && !meta.error;
    if (checkHandle) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);
  useEffect(() => {
    if (profileData) {
      setStatus({ handle: "Handle already taken" });
    } else if (status) {
      // clear handle status

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { handle, ...rest } = status;
      setStatus(rest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  return (
    <div>
      {children}
      <ProductButtonGroup>
        <Button
          theme="primary"
          type="submit"
          disabled={false}
          onClick={(e) => {
            e.preventDefault();
            if (isValid) {
              loginWithLens();
            }
          }}
        >
          Next
        </Button>
      </ProductButtonGroup>
    </div>
  );
}
