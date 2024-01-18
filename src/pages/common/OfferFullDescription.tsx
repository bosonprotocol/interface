import {
  ExternalOfferFullDescription,
  ExternalOfferFullDescriptionProps
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { MODAL_TYPES } from "components/modal/ModalComponents";
import { useModal } from "components/modal/useModal";
import { CONFIG } from "lib/config";
import { BosonRoutes } from "lib/routing/routes";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import React from "react";
import { styled } from "styled-components";

const StyledExternalOfferFullDescription = styled(ExternalOfferFullDescription)`
  .headers {
    background-color: var(--secondary);
    &:before {
      background-color: var(--secondary);
    }
    > * {
      background-color: var(--secondary);
    }
  }
`;

type OfferFullDescriptionProps = Omit<
  ExternalOfferFullDescriptionProps,
  | "providerProps"
  | "onExchangePolicyClick"
  | "onClickBuyOrSwap"
  | "walletConnectProjectId"
  | "includeGeneralProductDataTab"
>;

export const OfferFullDescription: React.FC<OfferFullDescriptionProps> = (
  props
) => {
  const navigate = useKeepQueryParamsNavigate();
  const { config } = useConfigContext();
  const { showModal } = useModal();
  return (
    <StyledExternalOfferFullDescription
      {...props}
      includeGeneralProductDataTab={false}
      defaultSelectedOfferTabsIdTab="physical-product-data"
      withFullViewportWidth={true}
      onExchangePolicyClick={({ exchangePolicyCheckResult }) =>
        showModal(MODAL_TYPES.EXCHANGE_POLICY_DETAILS, {
          title: "Exchange Policy Details",
          offerId: props.offer.id,
          offerData: props.offer,
          exchangePolicyCheckResult: exchangePolicyCheckResult
        })
      }
      onClickBuyOrSwap={({ swapParams }) => {
        navigate({ pathname: BosonRoutes.Swap, search: swapParams });
      }}
      providerProps={{
        ...CONFIG,
        envName: config.envName,
        configId: config.envConfig.configId,
        defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
        defaultCurrencyTicker: CONFIG.defaultCurrency.ticker,
        licenseTemplate: CONFIG.rNFTLicenseTemplate,
        minimumDisputeResolutionPeriodDays: CONFIG.minimumDisputePeriodInDays,
        walletConnectProjectId: CONFIG.walletConnect.projectId,
        contactSellerForExchangeUrl: ""
      }}
    />
  );
};
