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
    console.log("26-1 roberto");
    if (store.shouldDisplayModal) {
      showModal(modalTypes.CREATE_PRODUCT_DRAFT, {
        title: "Draft",
        chooseNew,
        chooseDraft
      });
    } else {
      console.log("34-1 roberto");
      setDraftModalClosed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showInvalidRoleModal = useCallback(() => {
    console.log("41-1 roberto");
    showModal<"INVALID_ROLE">(modalTypes.INVALID_ROLE, {
      title: "Invalid Role",
      action: "create a product",
      requiredRole: "operator",
      closable: false
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("roberto 49-1");

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
