/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { createContext } from "react";

import { MODAL_COMPONENTS, MODAL_TYPES } from "./ModalComponents";

export type ModalProps = {
  title?: string;
};
export type ModalType = keyof typeof MODAL_TYPES | null;

export type Store = {
  modalType: ModalType;
  modalProps?: Parameters<ModalContextType["showModal"]>[1];
};

export interface ModalContextType {
  showModal: <T extends keyof typeof MODAL_TYPES>(
    modalType: T,
    modalProps?: Parameters<typeof MODAL_COMPONENTS[T]>[0] extends undefined
      ? ModalProps
      : ModalProps & Parameters<typeof MODAL_COMPONENTS[T]>[0]
  ) => void;
  hideModal: () => void;
  store: Store;
}

export const initalState: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
  store: {
    modalType: null,
    modalProps: {} as any
  }
};

const ModalContext = createContext(initalState as ModalContextType);

export default ModalContext;
