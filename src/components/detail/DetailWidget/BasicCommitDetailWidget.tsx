import { ExternalCommitDetailView } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { MODAL_TYPES } from "components/modal/ModalComponents";
import { useModal } from "components/modal/useModal";
import { CONFIG } from "lib/config";
import { BosonRoutes } from "lib/routing/routes";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import { VariantV1 } from "pages/products/types";
import React, { ReactNode } from "react";

import { useCurationLists } from "../../../lib/utils/hooks/useCurationLists";

type BasicCommitDetailWidgetProps = {
  selectedVariant: VariantV1;
  isPreview: boolean;
  children?: ReactNode;
};

export const BasicCommitDetailWidget: React.FC<
  BasicCommitDetailWidgetProps
> = ({ selectedVariant, isPreview, children }) => {
  const { showModal } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const { config } = useConfigContext();
  const curationLists = useCurationLists();

  return (
    <ExternalCommitDetailView
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
        sellerCurationListBetweenCommas:
          curationLists?.sellerCurationList?.join(",") || "",
        withReduxProvider: false,
        withCustomReduxContext: false,
        withWeb3React: false
      }}
      selectedVariant={selectedVariant}
      showPriceAsterisk={isPreview}
      showBosonLogo={false}
      onExchangePolicyClick={({ exchangePolicyCheckResult }) => {
        showModal(MODAL_TYPES.EXCHANGE_POLICY_DETAILS, {
          title: "Exchange Policy Details",
          offerId: selectedVariant.offer.id,
          offerData: selectedVariant.offer,
          exchangePolicyCheckResult: exchangePolicyCheckResult
        });
      }}
      onPurchaseOverview={() => {
        showModal(MODAL_TYPES.WHAT_IS_REDEEM, {
          title: "Commit to Buy and Redeem"
        });
      }}
      onClickBuyOrSwap={({ swapParams }) => {
        navigate({ pathname: BosonRoutes.Swap, search: swapParams });
      }}
      onAlreadyOwnOfferClick={() => {
        navigate({ pathname: BosonRoutes.YourAccount });
      }}
    >
      <>{children}</>
    </ExternalCommitDetailView>
  );
};
