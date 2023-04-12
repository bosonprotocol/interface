import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Loading from "../../../ui/Loading";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
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
import CreateYourProfile from "./Regular/CreateYourRegularProfile";

export default function EditProfileModal() {
  const { sellers: currentSellers, lens, isFetching } = useCurrentSellers();
  const seller = currentSellers?.length ? currentSellers[0] : undefined;
  const lensProfile = lens?.length ? lens[0] : undefined;
  const useLens = true; // TODO: read from protocol
  const navigate = useKeepQueryParamsNavigate();
  const { hideModal } = useModal();
  const [profileType, setProfileType] = useState<"lens" | "regular">(
    useLens ? "lens" : "regular"
  );
  const { address = "" } = useAccount();

  const Component = useCallback(() => {
    return profileType === "lens" ? (
      <LensProfileFlow
        onSubmit={() => {
          hideModal();
        }}
        isEdit
        seller={seller || null}
        lensProfile={lensProfile}
        changeToRegularProfile={() => setProfileType("regular")}
      />
    ) : (
      <CreateYourProfile
        initial={
          lensProfile
            ? {
                name: getLensName(lensProfile),
                description: getLensDescription(lensProfile),
                email: getLensEmail(lensProfile),
                legalTradingName: getLensLegalTradingName(lensProfile),
                website: getLensWebsite(lensProfile),
                coverPicture: [{ src: getLensCoverPictureUrl(lensProfile) }],
                logo: [{ src: getLensProfilePictureUrl(lensProfile) }]
              }
            : undefined
        }
        isEdit
        onSubmit={() => {
          hideModal();
        }}
        changeToLensProfile={() => setProfileType("lens")}
      />
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

  if (isFetching) {
    return <Loading />;
  }

  return <Component />;
}
