import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import useUpdateSellerMetadata from "../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../product/utils";
import SuccessToast from "../../../toasts/common/SuccessToast";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Loading from "../../../ui/Loading";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ProfileType } from "./const";
import LensProfileFlow from "./Lens/LensProfileFlow";
import {
  getLensCoverPictureUrl,
  getLensDescription,
  getLensEmail,
  getLensLegalTradingName,
  getLensName,
  getLensProfilePictureUrl,
  getLensWebsite
} from "./Lens/utils";
import { EditRegularProfileFlow } from "./Regular/EditRegularProfileFlow";

export default function EditProfileModal() {
  const { sellers: currentSellers, lens, isFetching } = useCurrentSellers();
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
    return profileType === ProfileType.LENS ? (
      <LensProfileFlow
        onSubmit={async () => {
          hideModal();
        }}
        isEdit
        forceDirty={!hasMetadata}
        seller={seller || null}
        lensProfile={lensProfile}
        changeToRegularProfile={() => setProfileType(ProfileType.REGULAR)}
        updateSellerMetadata={updateSellerMetadata}
      />
    ) : seller && ((useLens && lensProfile) || metadata) ? (
      <EditRegularProfileFlow
        profileInitialData={
          useLens && lensProfile
            ? {
                name: getLensName(lensProfile),
                description: getLensDescription(lensProfile),
                email: getLensEmail(lensProfile),
                legalTradingName: getLensLegalTradingName(lensProfile),
                website: getLensWebsite(lensProfile),
                coverPicture: [{ src: getLensCoverPictureUrl(lensProfile) }],
                logo: [{ src: getLensProfilePictureUrl(lensProfile) }],
                contactPreference:
                  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.find(
                    (obj) => obj.value === seller.metadata?.contactPreference
                  ) ?? OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
              }
            : profileDataFromMetadata
        }
        forceDirty={!hasMetadata}
        onSubmit={async (values, dirty) => {
          if (dirty || !seller?.metadata) {
            await updateSellerMetadata({ values, kind: ProfileType.REGULAR });
            toast((t) => (
              <SuccessToast t={t}>Seller profile has been updated</SuccessToast>
            ));
          }
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

  if (isFetching) {
    return <Loading />;
  }

  return <Component />;
}
