/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { subgraph } from "@bosonprotocol/react-kit";
import { createContext } from "react";

import { MODAL_TYPES } from "./ModalComponents";

export type ModalProps = {
  title?: string;
  message?: string;
  type?: string;
  state?: keyof typeof subgraph.ExchangeState;
  [x: string]: any;
};
export type ModalType = keyof typeof MODAL_TYPES | null;

export type Store = {
  modalType: ModalType;
  modalProps?: ModalProps;
};

export interface ModalContextType {
  showModal: (modalType: ModalType, modalProps?: ModalProps) => void;
  hideModal: () => void;
  store: Store;
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
