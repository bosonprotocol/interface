import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import Button from "components/ui/Button";
import { BosonRoutes } from "lib/routing/routes";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router-dom";

import {
  getNextButtonText,
  getNextStepFromQueryParams,
  getNextTo,
  getSlTitle,
  getVariableStepsFromQueryParams,
  QueryParamStep,
  useRemoveLandingQueryParams,
  VariableStep
} from "../../components/modal/components/createProduct/const";
import { useModal } from "../../components/modal/useModal";
import { CreateProductForm } from "../../components/product/utils/types";
import { useInitialValues } from "../../components/product/utils/useInitialValues";
import { SellerLandingPageParameters } from "../../lib/routing/parameters";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import NotFound from "../not-found/NotFound";
import { CongratulationsType } from "./congratulations/Congratulations";
import { CongratulationsPage } from "./congratulations/CongratulationsPage";
import CreateProductInner from "./CreateProductInner";

export default function CreateProductWrapper() {
  const { config } = useConfigContext();
  const navigate = useKeepQueryParamsNavigate();
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <div>
          <p>
            Something when wrong, please refresh the page to try again or go
            back to the home page
          </p>

          <Button
            theme="warning"
            onClick={() => navigate({ pathname: BosonRoutes.Root })}
          >
            Go back
          </Button>
        </div>
      )}
      onError={(error) => {
        Sentry.captureException(error);
      }}
    >
      <CreateProduct key={config.envConfig.configId} />
    </ErrorBoundary>
  );
}

function CreateProduct() {
  const store = useInitialValues();
  const [searchParams] = useSearchParams();
  const [initial, setInitial] = useState<CreateProductForm>(
    store.fromProductUuid ?? store.base
  );
  useEffect(() => {
    if (store.fromProductUuid) {
      setInitial(store.fromProductUuid);
    }
  }, [store.fromProductUuid]);
  const [createdOffersIds, setCreatedOffersIds] = useState<string[]>([]);
  const [isDraftModalClosed, setDraftModalClosed] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();
  const { sellers } = useCurrentSellers();
  const seller = sellers?.[0];
  const checkIfSellerIsInCurationList = useSellerCurationListFn();
  const isSellerCurated = !!seller && checkIfSellerIsInCurationList(seller.id);

  const chooseNew = () => {
    store.remove(store.key);
    setDraftModalClosed(true);
    hideModal();
  };
  const chooseDraft = () => {
    setInitial(store.draft);
    setDraftModalClosed(true);
    hideModal();
  };

  const showCreateProductDraftModal = useCallback(() => {
    if (!!seller && store.shouldDisplayModal) {
      showModal(
        modalTypes.CREATE_PRODUCT_DRAFT,
        {
          title: "Draft",
          chooseNew,
          chooseDraft,
          closable: false
        },
        "auto",
        undefined,
        {
          xs: "100%",
          s: "31.25rem"
        }
      );
    } else {
      setDraftModalClosed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seller]);
  const removeLandingQueryParams = useRemoveLandingQueryParams();
  const isTokenGated = searchParams.get(
    SellerLandingPageParameters.sltokenGated
  );
  const nextStepResult = useMemo(() => {
    return getNextStepFromQueryParams(
      searchParams,
      isTokenGated ? QueryParamStep.tokenproduct : QueryParamStep.product
    );
  }, [isTokenGated, searchParams]);
  useEffect(() => {
    if (createdOffersIds.length) {
      if (nextStepResult) {
        hideModal();
        showModal("VARIABLE_STEPS_EXPLAINER", {
          title: getSlTitle(searchParams),
          doSetQueryParams: false,
          order: getVariableStepsFromQueryParams(searchParams) as [
            VariableStep,
            VariableStep,
            VariableStep
          ],
          text: "Your product is now successfully created! ",
          buttonText: getNextButtonText(nextStepResult.nextStep),
          to: getNextTo(nextStepResult.nextStep),
          firstActiveStep: nextStepResult.nextStepInNumber
        });
      } else {
        removeLandingQueryParams();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdOffersIds, removeLandingQueryParams, nextStepResult]);

  if (!!seller && !isSellerCurated) {
    return <NotFound />;
  }

  return !nextStepResult && createdOffersIds.length ? (
    <CongratulationsPage
      reset={() => setCreatedOffersIds([])}
      sellerId={seller?.id}
      type={CongratulationsType.NewProduct}
    />
  ) : (
    <CreateProductInner
      initial={initial}
      showCreateProductDraftModal={showCreateProductDraftModal}
      isDraftModalClosed={isDraftModalClosed}
      setCreatedOffersIds={setCreatedOffersIds}
    />
  );
}
