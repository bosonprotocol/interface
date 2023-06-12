import { AuthTokenType } from "@bosonprotocol/react-kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { colors } from "../../../../lib/styles/colors";
import useUpdateSellerMetadata from "../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { Switch } from "../../../form/Switch";
import { CreateProfile } from "../../../product/utils";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Loading from "../../../ui/Loading";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ProfileType } from "./const";
import LensProfileFlow from "./Lens/LensProfileFlow";
import { EditRegularProfileFlow } from "./Regular/EditRegularProfileFlow";
import { buildRegularProfileFromMetadata } from "./utils";

export default function EditProfileModal() {
  const { sellers: currentSellers, lens, isLoading } = useCurrentSellers();
  const seller = currentSellers?.length ? currentSellers[0] : undefined;
  const lensProfile = lens?.length ? lens[0] : undefined;
  const hasMetadata = !!seller?.metadata;
  const metadata = seller?.metadata;
  const useLens = seller?.authTokenType === AuthTokenType.LENS;
  const navigate = useKeepQueryParamsNavigate();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  const { hideModal } = useModal();
  const [profileType, setProfileType] = useState<ProfileType>(
    useLens ? ProfileType.LENS : ProfileType.REGULAR
  );
  const { address = "" } = useAccount();
  const [switchChecked, setSwitchChecked] = useState<boolean>(
    profileType === ProfileType.LENS
  );
  const setSwitchAndProfileType = useCallback((switchToLens: boolean) => {
    setSwitchChecked(switchToLens);
    setProfileType(switchToLens ? ProfileType.LENS : ProfileType.REGULAR);
  }, []);
  const SwitchButton = useCallback(
    () => (
      <Switch
        onCheckedChange={(checked) => {
          setSwitchAndProfileType(checked);
        }}
        gridProps={{
          justifyContent: "flex-end"
        }}
        checked={switchChecked}
        label={() => (
          <Typography
            color={colors.secondary}
            $fontSize="0.8rem"
            onClick={() => setSwitchAndProfileType(!switchChecked)}
            cursor="pointer"
          >
            Link Lens Profile
          </Typography>
        )}
      />
    ),
    [switchChecked, setSwitchAndProfileType]
  );
  const Component = useCallback(() => {
    const profileDataFromMetadata: CreateProfile =
      buildRegularProfileFromMetadata(metadata);
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
        changeToRegularProfile={() => setSwitchAndProfileType(false)}
        switchButton={SwitchButton}
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
        switchButton={SwitchButton}
      />
    ) : (
      <p>There has been an error, please try again...</p>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileType]);

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
