// extracted from https://usehooks.com/useLocalStorage/
import { useState } from "react";

export type CreateProductImageCreteYourProfileLogo =
  "create-product-image_createYourProfile.logo";

export type CreateProductImageProductImages =
  | "create-product-image_productImages.thumbnail"
  | "create-product-image_productImages.secondary"
  | "create-product-image_productImages.everyAngle"
  | "create-product-image_productImages.details"
  | "create-product-image_productImages.inUse"
  | "create-product-image_productImages.styledScene"
  | "create-product-image_productImages.sizeAndScale"
  | "create-product-image_productImages.more";

export type GetItemFromStorageKey =
  | "wagmi.store"
  | "isChainUnsupported"
  | "create-product"
  | "tracing-url"
  | CreateProductImageProductImages
  | CreateProductImageCreteYourProfileLogo;

export function getItemFromStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
) {
  if (typeof window === "undefined") {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
}

export function saveItemInStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }
}

export function removeItemInStorage(key: string) {
  if (typeof window !== "undefined") {
    try {
      Object.keys(localStorage)
        .filter((filterKey) => filterKey?.includes(key))
        .map((finalKey) => localStorage.removeItem(finalKey));
    } catch (error) {
      console.log(error);
    }
  }
}

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }
};

export function useLocalStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getItemFromStorage(key, initialValue)
  );

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      saveItemInStorage(key, valueToStore);
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue, removeItemInStorage] as const;
}
