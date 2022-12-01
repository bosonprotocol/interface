/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { subgraph } from "@bosonprotocol/react-kit";
import React, { createContext, ReactNode } from "react";

import { MODAL_COMPONENTS, MODAL_TYPES } from "./ModalComponents";

export type ModalProps = {
  title?: string;
  message?: string;
  type?: string;
  state?: keyof typeof subgraph.ExchangeState;
  noCloseIcon?: boolean;
  [x: string]: any;

  headerComponent?: ReactNode;
  hideModal?: () => void;
  closable?: boolean;
};
export type ModalType = keyof typeof MODAL_TYPES | null;
type ModalSize = "xxs" | "xs" | "s" | "m" | "l" | "xl";
export type Store = {
  modalType: ModalType;
  modalProps?: Parameters<ModalContextType["showModal"]>[1];
  modalSize?: ModalSize | "auto" | "fullscreen";
  modalMaxWidth?: Partial<
    Record<ModalSize, React.CSSProperties["maxWidth"]>
  > | null;
  theme?: "light" | "dark";
};

export interface ModalContextType {
  showModal: <T extends keyof typeof MODAL_TYPES>(
    modalType: T,
    modalProps?: Omit<
      Parameters<typeof MODAL_COMPONENTS[T]>,
      "hideModal"
    >[0] extends undefined
      ? Omit<ModalProps, "hideModal">
      : Omit<ModalProps, "hideModal"> &
          Omit<Parameters<typeof MODAL_COMPONENTS[T]>[0], "hideModal">,
    modalSize?: Store["modalSize"],
    theme?: Store["theme"],
    modalMaxWidth?: Store["modalMaxWidth"]
  ) => void;
  hideModal: (data?: unknown | undefined | null) => void;

  updateProps: <T extends keyof typeof MODAL_TYPES>(
    store: Store & {
      modalProps: Omit<
        Parameters<typeof MODAL_COMPONENTS[T]>,
        "hideModal"
      >[0] extends undefined
        ? Partial<Omit<ModalProps, "hideModal">>
        : Partial<
            Omit<ModalProps, "hideModal"> &
              Omit<Parameters<typeof MODAL_COMPONENTS[T]>[0], "hideModal">
          >;
      modalSize?: Store["modalSize"];
      modalMaxWidth?: Store["modalMaxWidth"];
      theme?: Store["theme"];
    }
  ) => void;

  store: Store;
}

export const initalState: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
  updateProps: () => {},
  store: {
    modalType: null,
    modalProps: {} as any,
    modalSize: "l",
    modalMaxWidth: null,
    theme: "light"
  } as const
};

const ModalContext = createContext(initalState as ModalContextType);

export default ModalContext;
