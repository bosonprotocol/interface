/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { createContext } from "react";

interface ModalContextType {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
}

export const initalState: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
  store: {
    modalType: null,
    modalProps: {}
  }
};

const ModalContext = createContext(initalState as ModalContextType);

export default ModalContext;
