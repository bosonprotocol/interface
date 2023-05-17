import { subgraph } from "@bosonprotocol/react-kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { colors } from "../../../../lib/styles/colors";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import useUpdateSellerMetadata from "../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Switch from "../../../form/Switch";
import { CreateProfile } from "../../../product/utils";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Loading from "../../../ui/Loading";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ChooseProfileType } from "./ChooseProfileType";
import { ProfileType } from "./const";
import LensProfileFlow from "./Lens/LensProfileFlow";
import { CreateRegularProfileFlow } from "./Regular/CreateRegularProfileFlow";

interface Props {
  initialRegularCreateProfile: CreateProfile;
  onRegularProfileCreated?: (createValues: CreateProfile) => void;
  seller?: subgraph.SellerFieldsFragment;
  lensProfile?: Profile;
}

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated,
  seller,
  lensProfile: selectedProfile
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  const { address = "" } = useAccount();

  const {
    data: lensData,
    isLoading,
    isSuccess
  } = useGetLensProfiles(
    {
      ownedBy: [address],
      limit: 50
    },
    {
      enabled: !!address
    }
  );
  const hasLensProfile = !!lensData?.items.length;
  useEffect(() => {
    if (isSuccess && !hasLensProfile) {
      setProfileType(ProfileType.REGULAR); // no need to see lens step as you dont have any profile
    }
  }, [isSuccess, hasLensProfile]);
  const { hideModal } = useModal();
  const [profileType, setProfileType] = useState<ProfileType | undefined>(
    undefined
  );

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
        label={
          <Typography
            color={colors.secondary}
            $fontSize="0.8rem"
            onClick={() => setSwitchAndProfileType(!switchChecked)}
            cursor="pointer"
          >
            Link Lens Profile
          </Typography>
        }
      />
    ),
    [switchChecked, setSwitchAndProfileType]
  );
  const Component = useCallback(() => {
    return profileType === ProfileType.LENS ? (
      <LensProfileFlow
        onSubmit={async (id, overrides) => {
          hideModal(selectedProfile);
          if (selectedProfile) {
            onRegularProfileCreated?.(overrides);
          }
        }}
        isEdit={false}
        seller={seller || null}
        lensProfile={selectedProfile}
        changeToRegularProfile={() => setSwitchAndProfileType(false)}
        switchButton={SwitchButton}
        updateSellerMetadata={updateSellerMetadata}
      />
    ) : (
      <CreateRegularProfileFlow
        initialData={initialRegularCreateProfile}
        onSubmit={(regularProfile) => {
          toast((t) => (
            <SuccessTransactionToast t={t} action="Create Seller Account" />
          ));
          onRegularProfileCreated?.(regularProfile);
          hideModal();
        }}
        switchButton={SwitchButton}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRegularCreateProfile, onRegularProfileCreated, profileType]);

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

  if (profileType === undefined && hasLensProfile) {
    return <ChooseProfileType setProfileType={setProfileType} />;
  }

  return <Component />;
}
