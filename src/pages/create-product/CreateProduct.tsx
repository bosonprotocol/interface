import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getNextButtonText,
  getNextStepFromQueryParams,
  getNextTo,
  getVariableStepsFromQueryParams,
  QueryParamStep,
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

export default function CreateProduct() {
  const store = useInitialValues();
  const [searchParams] = useSearchParams();
  const [initial, setInitial] = useState<CreateProductForm>(store.base);
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
  console.log(
    "createdOffersIds",
    createdOffersIds,
    "searchParams",
    searchParams
  );
  useEffect(() => {
    if (createdOffersIds.length) {
      const nextStepResult = getNextStepFromQueryParams(
        searchParams,
        QueryParamStep.product
      );

      if (nextStepResult) {
        hideModal();
        showModal("VARIABLE_STEPS_EXPLAINER", {
          title: searchParams.get(SellerLandingPageParameters.sltitle) ?? "",
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
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdOffersIds]);

  if (!!seller && !isSellerCurated) {
    return <NotFound />;
  }

  return createdOffersIds.length ? (
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
