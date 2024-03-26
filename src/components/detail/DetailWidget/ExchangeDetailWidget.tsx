import {
  exchanges,
  ExternalExchangeDetailView,
  hooks,
  RedemptionWidgetAction,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { MODAL_TYPES } from "components/modal/ModalComponents";
import { useModal } from "components/modal/useModal";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import dayjs from "dayjs";
import { CONFIG } from "lib/config";
import { BosonRoutes } from "lib/routing/routes";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { getHasExchangeDisputeResolutionElapsed } from "lib/utils/exchange";
import { titleCase } from "lib/utils/formatText";
import { getDateTimestamp } from "lib/utils/getDateTimestamp";
import {
  useAccount,
  useChainId,
  useSigner
} from "lib/utils/hooks/connection/connection";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "pages/custom-store/useCustomStoreQueryParameter";
import { VariantV1 } from "pages/products/types";
import { ArrowRight, Check } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useCurationLists } from "../../../lib/utils/hooks/useCurationLists";
import {
  ContactSellerButton,
  RaiseProblemButton,
  RedeemLeftButton,
  StyledCancelButton
} from "../Detail.style";

const RedeemButton = styled(BosonButton)`
  padding: 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;

  && {
    > div {
      width: 100%;
      gap: 1rem;
      display: flex;
      align-items: stretch;
      justify-content: center;
      small {
        align-items: center;
      }
    }

    ${breakpoint.s} {
      > div {
        gap: 0.5rem;
      }
    }
    ${breakpoint.m} {
      > div {
        gap: 1rem;
      }
    }
  }
`;

const NOT_REDEEMED_YET = [
  subgraph.ExchangeState.COMMITTED,
  subgraph.ExchangeState.REVOKED,
  subgraph.ExchangeState.CANCELLED,
  exchanges.ExtendedExchangeState.Expired,
  subgraph.ExchangeState.COMPLETED,
  exchanges.ExtendedExchangeState.NotRedeemableYet
];

type ExchangeDetailWidgetProps = {
  variant: VariantV1;
  exchange: hooks.ExtendedExchange;
};

export const ExchangeDetailWidget: React.FC<ExchangeDetailWidgetProps> = ({
  variant,
  exchange
}) => {
  const { offer } = variant;
  const { showModal } = useModal();
  const navigate = useKeepQueryParamsNavigate();

  const { config } = useConfigContext();
  const curationLists = useCurationLists();
  const connectedChainId = useChainId();
  const signer = useSigner();
  const { account: address } = useAccount();

  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const isSeller = exchange?.seller.assistant === address?.toLowerCase();
  const isCustomStoreFront =
    useCustomStoreQueryParameter("isCustomStoreFront") === "true";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
    : null;

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.COMMITTED;
  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);
  const isExchangeExpired =
    !!exchangeStatus &&
    exchanges.ExtendedExchangeState.Expired === exchangeStatus;
  const isRedeemDisabled = !isBuyer || isExchangeExpired;
  const disabledRedeemText =
    exchangeStatus === exchanges.ExtendedExchangeState.NotRedeemableYet
      ? "Redeem"
      : titleCase(exchangeStatus || "Unsupported");
  const hasDisputePeriodElapsed: boolean =
    getHasExchangeDisputeResolutionElapsed(exchange, offer);
  const voucherRedeemableUntilDate = dayjs(
    getDateTimestamp(
      exchange?.validUntilDate ?? exchange.offer.voucherRedeemableUntilDate
    )
  );
  const nowDate = dayjs();

  const ButtonWrapper = ({ children }: { children?: JSX.Element }) => {
    const iframeRef = useRef<HTMLIFrameElement>();
    const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
    const { reload: reloadIframeListener } = hooks.useCallSignerFromIframe({
      iframeRef,
      isIframeLoaded,
      signer,
      childIframeOrigin: CONFIG.widgetsUrl as `http${string}`
    });
    useEffect(() => {
      // Reload the widget script after rendering the component
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.bosonWidgetReload(function onLoadIframe({ iframe }) {
          iframeRef.current = iframe;
          setIsIframeLoaded(true);
          reloadIframeListener();
        });
      } catch (e) {
        console.error(e);
        Sentry.captureException(e);
      }
    }, [reloadIframeListener]);
    return <>{children}</>;
  };

  const totalHours = voucherRedeemableUntilDate.diff(nowDate, "hours");
  const redeemableDays = Math.floor(totalHours / 24);
  const redeemableHours = totalHours - redeemableDays * 24;
  return (
    <ExternalExchangeDetailView
      providerProps={{
        ...CONFIG,
        envName: config.envName,
        configId: config.envConfig.configId,
        walletConnectProjectId: CONFIG.walletConnect.projectId,
        defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
        defaultCurrencyTicker: CONFIG.defaultCurrency.ticker,
        licenseTemplate: CONFIG.rNFTLicenseTemplate,
        minimumDisputeResolutionPeriodDays: CONFIG.minimumDisputePeriodInDays,
        contactSellerForExchangeUrl: "",
        widgetAction: RedemptionWidgetAction.REDEEM_FORM,
        showRedemptionOverview: true,
        exchangeState: exchange.state,
        sendDeliveryInfoThroughXMTP: true,
        sellerCurationListBetweenCommas:
          curationLists?.sellerCurationList?.join(",") || "",
        withExternalConnectionProps: true,
        externalConnectedChainId: connectedChainId,
        externalConnectedAccount: address,
        externalConnectedSigner: signer
      }}
      showBosonLogo={isCustomStoreFront}
      showPriceAsterisk={false}
      exchange={{ ...exchange, offer }}
      selectedVariant={variant}
      onExchangePolicyClick={({ exchangePolicyCheckResult }) => {
        showModal(MODAL_TYPES.EXCHANGE_POLICY_DETAILS, {
          title: "Exchange Policy Details",
          offerId: offer.id,
          offerData: offer,
          exchangePolicyCheckResult: exchangePolicyCheckResult
        });
      }}
      onPurchaseOverview={() => {
        showModal(MODAL_TYPES.WHAT_IS_REDEEM, {
          title: "Commit to Buy and Redeem"
        });
      }}
      topChildren={
        isExchangeExpired ? (
          <Grid
            alignItems="center"
            justifyContent="space-between"
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (exchange) {
                showModal(
                  MODAL_TYPES.EXPIRE_VOUCHER_MODAL,
                  {
                    title: "Expire Voucher",
                    exchange
                  },
                  "auto"
                );
              }
            }}
          >
            <Typography
              tag="p"
              style={{ color: colors.darkGrey, margin: 0 }}
              fontSize="0.75rem"
            >
              You can withdraw your funds here
            </Typography>
            <ArrowRight size={18} color={colors.darkGrey} />
          </Grid>
        ) : isToRedeem ? (
          <RedeemLeftButton style={{ paddingTop: 0, paddingBottom: 0 }}>
            {redeemableDays > 0
              ? `${redeemableDays} days left to Redeem`
              : `${redeemableHours} hours left to Redeem`}
          </RedeemLeftButton>
        ) : null
      }
      bottomChildren={
        <>
          <Grid as="section">
            <ContactSellerButton
              onClick={() =>
                navigate({
                  pathname: `${BosonRoutes.Chat}/${exchange?.id || ""}`
                })
              }
              themeVal="blank"
              style={{ fontSize: "0.875rem" }}
              disabled={!isBuyer && !isSeller}
            >
              Contact seller
            </ContactSellerButton>
            {isBeforeRedeem ? (
              <ButtonWrapper>
                <>
                  {![
                    exchanges.ExtendedExchangeState.Expired,
                    subgraph.ExchangeState.CANCELLED,
                    subgraph.ExchangeState.REVOKED,
                    subgraph.ExchangeState.COMPLETED
                  ].includes(
                    exchangeStatus as
                      | exchanges.ExtendedExchangeState
                      | subgraph.ExchangeState
                  ) && (
                    <StyledCancelButton
                      themeVal="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={!isBuyer}
                      id="boson-redeem-cancel"
                      data-exchange-id={exchange?.id}
                      data-widget-action="CANCEL_FORM"
                      data-config-id={config.envConfig.configId}
                      data-account={address}
                      data-with-external-signer="true"
                      data-show-redemption-overview={false}
                    >
                      Cancel exchange
                    </StyledCancelButton>
                  )}
                </>
              </ButtonWrapper>
            ) : (
              <>
                {!exchange?.disputed && (
                  <RaiseProblemButton
                    onClick={() => {
                      showModal(
                        MODAL_TYPES.RAISE_DISPUTE,
                        {
                          title: "Raise a dispute",
                          exchangeId: exchange?.id || ""
                        },
                        "auto",
                        undefined,
                        { m: "1000px" }
                      );
                    }}
                    themeVal="blank"
                    style={{ fontSize: "0.875rem" }}
                    disabled={
                      exchange?.state !== "REDEEMED" ||
                      !isBuyer ||
                      hasDisputePeriodElapsed
                    }
                  >
                    Raise a dispute
                  </RaiseProblemButton>
                )}
              </>
            )}
          </Grid>
        </>
      }
    >
      <Grid flexDirection="column" alignItems="center" margin="1.5rem 0">
        {isToRedeem ? (
          <>
            <ButtonWrapper>
              <RedeemButton
                variant="primaryFill"
                size="large"
                disabled={isRedeemDisabled}
                id="boson-redeem-redeem"
                data-exchange-id={exchange?.id}
                data-widget-action="REDEEM_FORM"
                data-config-id={config.envConfig.configId}
                data-account={address}
                data-with-external-signer="true"
                withBosonStyle
                style={{ width: "100%" }}
              >
                <span>Redeem</span>
                <Typography
                  tag="small"
                  fontSize="0.75rem"
                  lineHeight="1.125rem"
                  fontWeight="600"
                  margin="0"
                >
                  Step 2/2
                </Typography>
              </RedeemButton>
            </ButtonWrapper>
            {!isRedeemDisabled && (
              <Typography
                fontSize="0.8rem"
                style={{ color: "initial", display: "block" }}
              >
                By proceeding to Redeem, I agree to the{" "}
                <span
                  style={{
                    fontSize: "inherit",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                  onClick={() => {
                    showModal("BUYER_SELLER_AGREEMENT", {
                      offerData: offer
                    });
                  }}
                >
                  Buyer & Seller Agreement
                </span>
                .
              </Typography>
            )}
          </>
        ) : (
          <Button themeVal="outline" disabled style={{ width: "100%" }}>
            {disabledRedeemText}
            <Check size={24} />
          </Button>
        )}
      </Grid>
    </ExternalExchangeDetailView>
  );
};
