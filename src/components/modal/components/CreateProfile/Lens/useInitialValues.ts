import { checkIfValueIsEmpty } from "../../../../../lib/utils/checkIfValueIsEmpty";
import { getLocalStorageItems } from "../../../../../lib/utils/getLocalStorageItems";
import { convertImageToFile } from "./../../../../../lib/utils/convertImageToFile";
import type { LensProfileType } from "./validationSchema";

interface ConvertedObject {
  [key: string]: File;
}
export const IMAGES_KEY = "select-lens-profile";

export function getConvertImagesFromLocalStorage() {
  const images = getLocalStorageItems({
    key: `${IMAGES_KEY}_`,
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

const parseInitialValues = (
  initialValues: LensProfileType,
  convertedImages: ConvertedObject
): LensProfileType => {
  if (initialValues !== null) {
    if (!checkIfValueIsEmpty(convertedImages)) {
      Object.keys(convertedImages).map((d: string) => {
        const keys = d.split(".");
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          initialValues[keys[0]] = [convertedImages[d]];
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
  const base = {
    logo: [],
    coverPicture: [],
    name: "",
    handle: "",
    email: "",
    description: "",
    website: "",
    legalTradingName: ""
  } as LensProfileType;

  const initialValues = parseInitialValues(base, convertedImages);
  return initialValues as LensProfileType;
}
