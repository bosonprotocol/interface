import { checkIfValueIsEmpty } from "../../../lib/utils/checkIfValueIsEmpty";
import { convertToBlob } from "../../../lib/utils/convertToBlob";
import { getLocalStorageItems } from "../../../lib/utils/getLocalStorageItems";
import {
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
    converted[key] = convertImage(value);
  }

  return {
    images,
    converted
  };
}
function convertImage({ value, key }: Image) {
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
}

const IMAGES_KEY = "create-product-image_";
const MAIN_KEY = "create-product";
export function useInitialValues() {
  const { converted: convertedImages } = getConvertImagesFromLocalStorage();
  const initialValues = getItemFromStorage<CreateProductForm | null>(
    MAIN_KEY,
    null
  );

  if (initialValues !== null && !checkIfValueIsEmpty(convertedImages)) {
    Object.keys(convertedImages).map((d: string) => {
      const keys = d.split(".");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initialValues[keys[0]][keys[1]] = [convertedImages[d]];
    });
  }

  return {
    shouldDisplayModal: initialValues !== null,
    base: baseValues,
    draft: initialValues,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    key: MAIN_KEY
  };
}
