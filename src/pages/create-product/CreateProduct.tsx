import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (store.shouldDisplayModal) {
      showModal(modalTypes.CREATE_PRODUCT_DRAFT, {
        title: "Draft",
        chooseNew,
        chooseDraft
      });
    }
  }, []); // eslint-disable-line

  return <CreateProductInner initial={initial} />;
}

export default CreateProduct;
