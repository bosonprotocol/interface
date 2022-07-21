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

interface Props {
  children: React.ReactNode;
}
export default function ModalProvider({ children }: Props) {
  const { pathname } = useLocation();
  const [store, setStore] = useState(initalState.store);
  const { modalType, modalProps } = store;

  const showModal = useCallback(
    (modalType: ModalType, modalProps?: Store["modalProps"]) => {
      setStore({
        ...store,
        modalType,
        modalProps
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

  useEffect(() => {
    if (modalType !== null) {
      hideModal();
    }
  }, [pathname]); // eslint-disable-line

  const renderComponent = () => {
    const ModalComponent = modalType ? MODAL_COMPONENTS[modalType] : null;
    if (!modalType || !ModalComponent) {
      document.body.style.overflow = "unset";
      return null;
    }

    document.body.style.overflow = "hidden";
    return (
      <Modal hideModal={hideModal} title={modalProps?.title}>
        <ModalComponent id="modal" {...(modalProps as any)} />
      </Modal>
    );
  };

  const value: ModalContextType = {
    store,
    showModal,
    hideModal
  } as ModalContextType;

  return (
    <ModalContext.Provider value={value}>
      {children}
      {renderComponent()}
    </ModalContext.Provider>
  );
}
