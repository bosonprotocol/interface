import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import useUpdateSellerMetadata from "../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../product/utils";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Loading from "../../../ui/Loading";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ProfileType } from "./const";
import LensProfileFlow from "./Lens/LensProfileFlow";
import { EditRegularProfileFlow } from "./Regular/EditRegularProfileFlow";

export default function EditProfileModal() {
  const { sellers: currentSellers, lens, isLoading } = useCurrentSellers();
  const seller = currentSellers?.length ? currentSellers[0] : undefined;
  const lensProfile = lens?.length ? lens[0] : undefined;
  const hasMetadata = !!seller?.metadata;
  const metadata = seller?.metadata;
  const useLens = seller?.metadata?.kind
    ? seller?.metadata?.kind === ProfileType.LENS
    : !!lensProfile;
  const navigate = useKeepQueryParamsNavigate();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  const { hideModal } = useModal();
  const [profileType, setProfileType] = useState<ProfileType>(
    useLens ? ProfileType.LENS : ProfileType.REGULAR
  );
  const { address = "" } = useAccount();

  const Component = useCallback(() => {
    const profileImage = metadata?.images?.find((img) => img.tag === "profile");
    const coverPicture = metadata?.images?.find((img) => img.tag === "cover");
    const profileDataFromMetadata: CreateProfile = {
      name: metadata?.name ?? "",
      description: metadata?.description ?? "",
      email:
        metadata?.contactLinks?.find((cl) => cl.tag === "email")?.url ?? "",
      legalTradingName: metadata?.legalTradingName ?? undefined,
      website: metadata?.website ?? "",
      coverPicture: coverPicture
        ? [{ ...coverPicture, src: coverPicture.url }] ?? []
        : [],
      logo: profileImage
        ? [{ ...profileImage, src: profileImage.url }] ?? []
        : [],
      contactPreference:
        OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.find(
          (obj) => obj.value === metadata?.contactPreference
        ) ?? OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
    };
    const forceDirty = !hasMetadata || metadata?.kind !== profileType;
    return profileType === ProfileType.LENS ? (
      <LensProfileFlow
        onSubmit={async () => {
          hideModal();
        }}
        isEdit
        forceDirty={forceDirty}
        seller={seller || null}
        lensProfile={lensProfile}
        changeToRegularProfile={() => setProfileType(ProfileType.REGULAR)}
        updateSellerMetadata={updateSellerMetadata}
      />
    ) : seller ? (
      <EditRegularProfileFlow
        profileInitialData={profileDataFromMetadata}
        forceDirty={forceDirty}
        updateSellerMetadata={updateSellerMetadata}
        onSubmit={async () => {
          hideModal();
        }}
        changeToLensProfile={() => setProfileType(ProfileType.LENS)}
      />
    ) : (
      <p>There has been an error, please try again...</p>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMetadata, lensProfile, metadata, profileType, seller, useLens]);

  if (!address) {
    return (
      <>
        <Typography>
          To create a profile you must first connect your wallet
        </Typography>
        <Grid>
          <ConnectButton />

          <BosonButton
            variant="accentInverted"
            onClick={() => navigate({ pathname: BosonRoutes.Root })}
          >
            Go back to the home page
          </BosonButton>
        </Grid>
      </>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return <Component />;
}
