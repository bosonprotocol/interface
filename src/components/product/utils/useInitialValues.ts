import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

const MAIN_KEY = "create-product";
export function useInitialValues() {
  const initialValues = getItemFromStorage<CreateProductForm | null>(
    MAIN_KEY,
    null
  );

  return {
    shouldDisplayModal: initialValues !== null,
    base: baseValues,
    draft: initialValues,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    clear: clearLocalStorage,
    key: MAIN_KEY
  };
}
