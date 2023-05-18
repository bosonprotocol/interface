import { useCallback, useState } from "react";

import { useModal } from "../../components/modal/useModal";
import { CreateProductForm } from "../../components/product/utils/types";
import { useInitialValues } from "../../components/product/utils/useInitialValues";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import NotFound from "../not-found/NotFound";
import CreateProductInner from "./CreateProductInner";

function CreateProduct() {
  const store = useInitialValues();
  const [initial, setInitial] = useState<CreateProductForm>(store.base);
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

  const showInvalidRoleModal = useCallback(() => {
    showModal<"INVALID_ROLE">(modalTypes.INVALID_ROLE, {
      title: "Invalid Role",
      action: "create a product",
      requiredRole: "assistant",
      closable: false
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!!seller && !isSellerCurated) {
    return <NotFound />;
  }
  return (
    <CreateProductInner
      initial={initial}
      showCreateProductDraftModal={showCreateProductDraftModal}
      showInvalidRoleModal={showInvalidRoleModal}
      isDraftModalClosed={isDraftModalClosed}
    />
  );
}

export default CreateProduct;
