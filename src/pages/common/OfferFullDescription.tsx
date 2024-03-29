import {
  ExternalOfferFullDescription,
  ExternalOfferFullDescriptionProps
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { MODAL_TYPES } from "components/modal/ModalComponents";
import { useModal } from "components/modal/useModal";
import { CONFIG } from "lib/config";
import { BosonRoutes } from "lib/routing/routes";
import {
  useAccount,
  useChainId,
  useSigner
} from "lib/utils/hooks/connection/connection";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import React from "react";
import { styled } from "styled-components";

import { useCurationLists } from "../../lib/utils/hooks/useCurationLists";

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
  | "includeOverviewTab"
>;

export const OfferFullDescription: React.FC<OfferFullDescriptionProps> = (
  props
) => {
  const navigate = useKeepQueryParamsNavigate();
  const { config } = useConfigContext();
  const curationLists = useCurationLists();
  const { showModal } = useModal();
  const connectedChainId = useChainId();
  const { account } = useAccount();
  const signer = useSigner();
  return (
    <StyledExternalOfferFullDescription
      {...props}
      includeOverviewTab
      imagesToShow={3}
      includeGeneralProductDataTab={false}
      includeOverviewTab
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
        ipfsProjectId: CONFIG.infuraProjectId,
        ipfsProjectSecret: CONFIG.infuraProjectSecret,
        contactSellerForExchangeUrl: "",
        sellerCurationListBetweenCommas:
          curationLists?.sellerCurationList?.join(",") || "",
        withExternalConnectionProps: true,
        externalConnectedChainId: connectedChainId,
        externalConnectedAccount: account,
        externalConnectedSigner: signer
      }}
    />
  );
};
