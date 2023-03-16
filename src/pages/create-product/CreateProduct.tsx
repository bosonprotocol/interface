import { useCallback, useState } from "react";

import { useModal } from "../../components/modal/useModal";
import { CreateProductForm } from "../../components/product/utils/types";
import { useInitialValues } from "../../components/product/utils/useInitialValues";
import CreateProductInner from "./CreateProductInner";

function CreateProduct() {
  const store = useInitialValues();
  const [initial, setInitial] = useState<CreateProductForm>(store.base);
  const [isDraftModalClosed, setDraftModalClosed] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();

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
    if (store.shouldDisplayModal) {
      showModal(modalTypes.CREATE_PRODUCT_DRAFT, {
        title: "Draft",
        chooseNew,
        chooseDraft,
        closable: false
      });
    } else {
      setDraftModalClosed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showInvalidRoleModal = useCallback(() => {
    showModal<"INVALID_ROLE">(modalTypes.INVALID_ROLE, {
      title: "Invalid Role",
      action: "create a product",
      requiredRole: "assistant",
      closable: false
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
