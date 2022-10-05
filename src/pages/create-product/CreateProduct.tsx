import { useCallback, useState } from "react";

import { useModal } from "../../components/modal/useModal";
import { CreateProductForm } from "../../components/product/utils/types";
import { useInitialValues } from "../../components/product/utils/useInitialValues";
import CreateProductInner from "./CreateProductInner";

function CreateProduct() {
  const store = useInitialValues();
  const [initial, setInitial] = useState<CreateProductForm>(store.base);
  const { showModal, modalTypes, hideModal } = useModal();

  const chooseNew = () => {
    store.remove(store.key);
    hideModal();
  };
  const chooseDraft = () => {
    setInitial(store.draft);
    hideModal();
  };

  const showCreateProductDraftModal = useCallback(() => {
    if (store.shouldDisplayModal) {
      showModal(modalTypes.CREATE_PRODUCT_DRAFT, {
        title: "Draft",
        chooseNew,
        chooseDraft
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showInvalidRoleModal = useCallback(() => {
    showModal<"INVALID_ROLE">(modalTypes.INVALID_ROLE, {
      title: "Invalid Role",
      action: "create a product",
      requiredRole: "operator"
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CreateProductInner
      initial={initial}
      showCreateProductDraftModal={showCreateProductDraftModal}
      showInvalidRoleModal={showInvalidRoleModal}
    />
  );
}

export default CreateProduct;
