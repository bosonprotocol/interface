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
    console.log("hideModal call!!");
    setStore({
      ...store,
      modalType: null,
      modalProps: {} as Store["modalProps"]
    });
  }, [store]);

  const updateProps = useCallback((props: Store["modalProps"]) => {
    console.log("updateProps props", props);
    setStore({
      ...props
    } as any);
  }, []);

  useEffect(() => {
    if (store.modalType !== null) {
      hideModal();
    }
  }, [pathname]); // eslint-disable-line

  console.log("modalprovider store", store);

  const RenderModalComponent = () => {
    const ModalComponent = store.modalType
      ? MODAL_COMPONENTS[store.modalType]
      : null;
    if (!store.modalType || !ModalComponent) {
      document.body.style.overflow = "unset";
      return null;
    }

    document.body.style.overflow = "hidden";
    return (
      <Modal
        hideModal={hideModal}
        title={store.modalProps?.title}
        headerComponent={store.modalProps?.headerComponent}
      >
        <ModalComponent
          id="modal"
          {...(store.modalProps as any)}
          hideModal={hideModal}
        />
        <button onClick={() => console.log("store", store)}>store log</button>
        <button onClick={() => updateProps({ activeStep: 2 } as any)}>
          update props
        </button>
      </Modal>
    );
  };

  const value: ModalContextType = {
    store,
    updateProps,
    showModal,
    hideModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <RenderModalComponent />
    </ModalContext.Provider>
  );
}
