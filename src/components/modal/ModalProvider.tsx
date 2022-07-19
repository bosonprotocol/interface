/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Modal from "./Modal";
import { MODAL_COMPONENTS } from "./ModalComponents";
import ModalContext, { initalState } from "./ModalContext";

interface Props {
  children: React.ReactNode;
}
export default function ModalProvider({ children }: Props) {
  const { pathname } = useLocation();
  const [store, setStore] = useState(initalState.store);
  const { modalType, modalProps } = store;

  const showModal = useCallback(
    (modalType: string, modalProps: any = {}) => {
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
      modalProps: {}
    });
  }, [store]);

  useEffect(() => {
    if (modalType !== null) {
      hideModal();
    }
  }, [pathname]); // eslint-disable-line

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      document.body.style.overflow = "unset";
      return null;
    }

    document.body.style.overflow = "hidden";
    return (
      <Modal hideModal={hideModal} title={modalProps?.title}>
        <ModalComponent id="modal" {...modalProps} />
      </Modal>
    );
  };

  return (
    <ModalContext.Provider value={{ store, showModal, hideModal }}>
      {children}
      {renderComponent()}
    </ModalContext.Provider>
  );
}
