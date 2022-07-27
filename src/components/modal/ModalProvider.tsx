import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Modal from "./Modal";
import { MODAL_COMPONENTS } from "./ModalComponents";
import ModalContext, {
  initalState,
  ModalContextType,
  ModalProps,
  ModalType
} from "./ModalContext";

interface Props {
  children: React.ReactNode;
}
export default function ModalProvider({ children }: Props) {
  const { pathname } = useLocation();
  const [store, setStore] = useState(initalState.store);
  const { modalType, modalProps } = store;

  const showModal = useCallback(
    (modalType: ModalType, modalProps?: ModalProps) => {
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
    const ModalComponent = modalType ? MODAL_COMPONENTS[modalType] : null;
    if (!modalType || !ModalComponent) {
      document.body.style.overflow = "unset";
      return null;
    }

    document.body.style.overflow = "hidden";
    return (
      <Modal
        hideModal={hideModal}
        title={modalProps?.title}
        noCloseIcon={modalProps?.noCloseIcon}
        modalType={modalType}
      >
        <ModalComponent id="modal" {...modalProps} />
      </Modal>
    );
  };

  const value: ModalContextType = { store, showModal, hideModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {renderComponent()}
    </ModalContext.Provider>
  );
}
