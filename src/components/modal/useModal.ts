import { useContext } from "react";

import { MODAL_TYPES } from "./ModalComponents";
import ModalContext from "./ModalContext";

export type ShowModalFn = ReturnType<typeof useModal>["showModal"];
export type ModalTypes = ReturnType<typeof useModal>["modalTypes"];

export function useModal() {
  const context = useContext(ModalContext);

  return {
    ...context,
    modalTypes: MODAL_TYPES
  };
}
