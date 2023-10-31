import { Spinner } from "components/loading/Spinner";
import Modal from "components/modal/Modal";
import Typography from "components/ui/Typography";
import { CONFIG } from "lib/config";
import { DrCenterRoutes } from "lib/routing/drCenterRoutes";
import { BosonRoutes } from "lib/routing/routes";
import { colors } from "lib/styles/colors";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { getCurrentViewMode, getViewModeUrl, ViewMode } from "lib/viewMode";
import { useCallback, useEffect, useState } from "react";
import { useCloseModal, useModalIsOpen } from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import styled from "styled-components";

const Wrapper = styled.div`
  border-radius: 20px;
  box-shadow: 12px 16px 24px rgba(0, 0, 0, 0.24),
    12px 8px 12px rgba(0, 0, 0, 0.24), 4px 4px 8px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-flow: column nowrap;
  margin: 0;
  flex: 1 1;
  min-width: 375px;
  position: relative;
  width: 100%;
`;

const ErrorText = styled(Typography)`
  color: ${colors.red};
  margin: auto !important;
  text-align: center;
  width: 90%;
`;
const StyledIframe = styled.iframe`
  border-radius: 12px;
  bottom: 0;
  left: 0;
  height: calc(100% - 16px);
  margin: 8px;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 16px);
`;
const StyledSpinner = styled(Spinner)`
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
`;

const MOONPAY_SUPPORTED_CURRENCY_CODES = [
  "eth",
  "eth_arbitrum",
  "eth_optimism",
  "eth_polygon",
  "weth",
  "wbtc",
  "matic_polygon",
  "polygon",
  "usdc_arbitrum",
  "usdc_optimism",
  "usdc_polygon"
];

export default function FiatOnrampModal() {
  const moonpayLink = CONFIG.moonpay.link;
  const { account } = useAccount();
  const closeModal = useCloseModal();
  const fiatOnrampModalOpen = useModalIsOpen(ApplicationModal.FIAT_ONRAMP);

  const [signedIframeUrl, setSignedIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentViewMode = getCurrentViewMode();
  const rootUrl = getViewModeUrl(
    currentViewMode,
    currentViewMode === ViewMode.DAPP ? BosonRoutes.Root : DrCenterRoutes.Root
  );
  const fetchSignedIframeUrl = useCallback(async () => {
    if (!account) {
      setError("Please connect an account before making a purchase.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const signedIframeUrlFetchEndpoint = moonpayLink;
      const res = await fetch(signedIframeUrlFetchEndpoint, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          theme: "light",
          colorCode: colors.blue,
          defaultCurrencyCode: "eth",
          redirectUrl: rootUrl,
          walletAddresses: JSON.stringify(
            MOONPAY_SUPPORTED_CURRENCY_CODES.reduce(
              (acc, currencyCode) => ({
                ...acc,
                [currencyCode]: account
              }),
              {}
            )
          )
        })
      });
      const { url } = await res.json();
      setSignedIframeUrl(url);
    } catch (e) {
      console.error("there was an error fetching the link", e);
      setError(e?.toString() || "error");
    } finally {
      setLoading(false);
    }
  }, [account, rootUrl, moonpayLink]);

  useEffect(() => {
    fetchSignedIframeUrl();
  }, [fetchSignedIframeUrl]);

  return (
    <Modal
      hidden={!fiatOnrampModalOpen}
      hideModal={closeModal}
      modalType="MOON_PAY"
      theme="light"
      maxWidths={undefined}
      size="auto"
    >
      <Wrapper data-testid="fiat-onramp-modal">
        {error ? (
          <>
            <Typography>Moonpay Fiat On-ramp iframe</Typography>
            <ErrorText>
              something went wrong!
              <br />
              {error}
            </ErrorText>
          </>
        ) : loading ? (
          <StyledSpinner alt="loading spinner" size="90px" />
        ) : (
          <StyledIframe
            src={signedIframeUrl ?? ""}
            frameBorder="0"
            title="fiat-onramp-iframe"
          />
        )}
      </Wrapper>
    </Modal>
  );
}
