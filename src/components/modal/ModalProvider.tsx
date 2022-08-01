/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Modal from "./Modal";
import { MODAL_COMPONENTS } from "./ModalComponents";
import ModalContext, {
  initalState,
  ModalContextType,
  ModalType,
  Store
} from "./ModalContext";

const RenderModalComponent = ({
  store,
  hideModal
}: {
  store: Store;
  hideModal: () => void;
}) => {
  const ModalComponent = store.modalType
    ? MODAL_COMPONENTS[store.modalType]
    : null;
  if (!store.modalType || !ModalComponent) {
    document.body.style.overflow = "";
    return null;
  }
  document.body.style.overflow = "hidden";
  return (
    <Modal
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      size={store.modalSize || initalState.store.modalSize!}
      hideModal={hideModal}
      title={store.modalProps?.title}
      headerComponent={store.modalProps?.headerComponent}
    >
      <ModalComponent
        id="modal"
        {...(store.modalProps as any)}
        hideModal={hideModal}
      />
    </Modal>
  );
};

interface Props {
  children: React.ReactNode;
}
export default function ModalProvider({ children }: Props) {
  const { pathname } = useLocation();
  const [store, setStore] = useState(initalState.store);

  const showModal = useCallback(
    (
      modalType: ModalType,
      modalProps?: Store["modalProps"],
      modalSize?: Store["modalSize"]
    ) => {
      setStore({
        ...store,
        modalType,
        modalProps,
        modalSize
      });
    },
    [store]
  );

  const hideModal = useCallback(() => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {} as Store["modalProps"]
    });
  }, [store]);

  const updateProps = useCallback((store: Store) => {
    setStore({
      ...store
    });
  }, []);

  useEffect(() => {
    if (store.modalType !== null) {
      hideModal();
    }
  }, [pathname]); // eslint-disable-line

  const value: ModalContextType = {
    store,
    updateProps,
    showModal,
    hideModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <RenderModalComponent store={store} hideModal={hideModal} />
    </ModalContext.Provider>
  );
}
