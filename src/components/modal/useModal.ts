import { useContext } from "react";

import { MODAL_TYPES } from "./ModalComponents";
import ModalContext from "./ModalContext";

export function useModal() {
  const context = useContext(ModalContext);

  return {
    ...context,
    modalTypes: MODAL_TYPES
  };
}
