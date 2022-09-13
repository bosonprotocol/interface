import { checkIfValueIsEmpty } from "../../../lib/utils/checkIfValueIsEmpty";
import { convertToBlob } from "../../../lib/utils/convertToBlob";
import { getLocalStorageItems } from "../../../lib/utils/getLocalStorageItems";
import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

type Image = {
  value: string;
  key: string;
};

interface ConvertedObject {
  [key: string]: File;
}

function getConvertImagesFromLocalStorage() {
  const images = getLocalStorageItems({
    key: IMAGES_KEY,
    returnObjects: true
  });

  const converted: ConvertedObject = {};
  for (let index = 0; index < images.length; index++) {
    const value = images[index];
    const key = images[index].key;
    converted[key] = convertImageToFile(value);
  }

  return {
    images,
    converted
  };
}
const convertImageToFile = ({ value, key }: Image) => {
  const extension = value.split(";")[0].split("/")[1];
  const encoded = value.split(",")[1];

  const data = convertToBlob(encoded, `image/${extension}`);
  const blob = new Blob([data as BlobPart], {
    type: `image/${extension}`
  });

  const file = new File([blob as BlobPart], `${key}.${extension}`, {
    type: `image/${extension}`
  });

  return file;
};

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
