import { checkIfValueIsEmpty } from "../../../lib/utils/checkIfValueIsEmpty";
import { getLocalStorageItems } from "../../../lib/utils/getLocalStorageItems";
import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { convertImageToFile } from "./../../../lib/utils/convertImageToFile";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

interface ConvertedObject {
  [key: string]: File;
}

export function getConvertImagesFromLocalStorage() {
  const images = getLocalStorageItems({
    key: IMAGES_KEY,
    returnObjects: true
  });

  const converted: ConvertedObject = {};
  for (let index = 0; index < images.length; index++) {
    const value = images[index];
    const key = images[index].key;
    if (value !== null) {
      const file = convertImageToFile(value);
      if (file !== null) {
        converted[key] = file;
      }
    }
  }

  return {
    images,
    converted
  };
}
const IMAGES_KEY = "create-product-image_";
const MAIN_KEY = "create-product";

const parseInitialValues = (
  initialValues: CreateProductForm,
  convertedImages: ConvertedObject
): CreateProductForm => {
  if (initialValues !== null) {
    if (!checkIfValueIsEmpty(convertedImages)) {
      Object.keys(convertedImages).map((d: string) => {
        const keys = d.split(".");
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          initialValues[keys[0]][keys[1]] = [convertedImages[d]];
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  return initialValues;
};

export function useInitialValues() {
  const { converted: convertedImages } = getConvertImagesFromLocalStorage();
  const storageItems = getItemFromStorage<CreateProductForm | null>(
    MAIN_KEY,
    null
  );
  const initialValues = parseInitialValues(storageItems, convertedImages);

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
