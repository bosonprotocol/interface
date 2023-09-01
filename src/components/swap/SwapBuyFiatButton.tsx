import { useWeb3React } from "@web3-react/core";
import { useAccountDrawer } from "components/header/accountDrawer";
import Tooltip from "components/tooltip/Tooltip";
import Button from "components/ui/Button";
import { colors } from "lib/styles/colors";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import {
  useFiatOnrampAvailability,
  useOpenModal
} from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";

export const MOONPAY_REGION_AVAILABILITY_ARTICLE =
  "https://support.uniswap.org/hc/en-us/articles/11306664890381-Why-isn-t-MoonPay-available-in-my-region-";

enum BuyFiatFlowState {
  // Default initial state. User is not actively trying to buy fiat.
  INACTIVE,
  // Buy fiat flow is active and region availability has been checked.
  ACTIVE_CHECKING_REGION,
  // Buy fiat flow is active, feature is available in user's region & needs wallet connection.
  ACTIVE_NEEDS_ACCOUNT
}

const StyledTextButton = styled(Button)`
  color: ${colors.lightGrey};
  gap: 4px;
  &:focus {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`;

export default function SwapBuyFiatButton() {
  const { account } = useWeb3React();
  const openFiatOnRampModal = useOpenModal(ApplicationModal.FIAT_ONRAMP);
  const [checkFiatRegionAvailability, setCheckFiatRegionAvailability] =
    useState(false);
  const {
    available: fiatOnrampAvailable,
    availabilityChecked: fiatOnrampAvailabilityChecked,
    loading: fiatOnrampAvailabilityLoading
  } = useFiatOnrampAvailability(checkFiatRegionAvailability);
  const [buyFiatFlowState, setBuyFiatFlowState] = useState(
    BuyFiatFlowState.INACTIVE
  );
  const [walletDrawerOpen, toggleWalletDrawer] = useAccountDrawer();

  // Depending on the current state of the buy fiat flow the user is in (buyFiatFlowState),
  // the desired behavior of clicking the 'Buy' button is different.
  // 1) Initially upon first click, need to check the availability of the feature in the user's
  // region, and continue the flow.
  // 2) If the feature is available in the user's region, need to connect a wallet, and continue
  // the flow.
  // 3) If the feature is available and a wallet account is connected, show fiat on ramp modal.
  // 4) If the feature is unavailable, show feature unavailable tooltip.
  const handleBuyCrypto = useCallback(() => {
    if (!fiatOnrampAvailabilityChecked) {
      setCheckFiatRegionAvailability(true);
      setBuyFiatFlowState(BuyFiatFlowState.ACTIVE_CHECKING_REGION);
    } else if (fiatOnrampAvailable && !account && !walletDrawerOpen) {
      toggleWalletDrawer();
      setBuyFiatFlowState(BuyFiatFlowState.ACTIVE_NEEDS_ACCOUNT);
    } else if (fiatOnrampAvailable && account) {
      openFiatOnRampModal();
      setBuyFiatFlowState(BuyFiatFlowState.INACTIVE);
    } else if (!fiatOnrampAvailable) {
      setBuyFiatFlowState(BuyFiatFlowState.INACTIVE);
    }
  }, [
    fiatOnrampAvailabilityChecked,
    fiatOnrampAvailable,
    account,
    walletDrawerOpen,
    toggleWalletDrawer,
    openFiatOnRampModal
  ]);

  // Continue buy fiat flow automatically when requisite state changes have occured.
  useEffect(() => {
    if (
      (buyFiatFlowState === BuyFiatFlowState.ACTIVE_CHECKING_REGION &&
        fiatOnrampAvailabilityChecked) ||
      (account && buyFiatFlowState === BuyFiatFlowState.ACTIVE_NEEDS_ACCOUNT)
    ) {
      handleBuyCrypto();
    }
  }, [
    account,
    handleBuyCrypto,
    buyFiatFlowState,
    fiatOnrampAvailabilityChecked
  ]);

  const buyCryptoButtonDisabled =
    (!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) ||
    fiatOnrampAvailabilityLoading ||
    // When wallet drawer is open AND user is in the connect wallet step of the buy fiat flow, disable buy fiat button.
    (walletDrawerOpen &&
      buyFiatFlowState === BuyFiatFlowState.ACTIVE_NEEDS_ACCOUNT);

  const fiatOnRampsUnavailableTooltipDisabled =
    !fiatOnrampAvailabilityChecked ||
    (fiatOnrampAvailabilityChecked && fiatOnrampAvailable);

  return (
    <Tooltip
      content={
        <div data-testid="fiat-on-ramp-unavailable-tooltip">
          <>Crypto purchases are not available in your region. </>

          <a
            href={MOONPAY_REGION_AVAILABILITY_ARTICLE}
            style={{ paddingLeft: "4px" }}
          >
            <>Learn more</>
          </a>
        </div>
      }
      placement="bottom"
      disabled={fiatOnRampsUnavailableTooltipDisabled}
    >
      <StyledTextButton
        onClick={handleBuyCrypto}
        disabled={buyCryptoButtonDisabled}
        data-testid="buy-fiat-button"
      >
        <>Buy</>
      </StyledTextButton>
    </Tooltip>
  );
}
