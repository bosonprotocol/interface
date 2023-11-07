// extracted from https://usehooks.com/useLocalStorage/

import * as Sentry from "@sentry/browser";
import { useState } from "react";

import { GetItemFromStorageKey } from "./const";

export function getItemFromStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
): T {
  if (typeof window === "undefined") {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return initialValue;
  }
}

export function saveItemInStorage<T>(key: GetItemFromStorageKey, value: T) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }
}

export function removeItemInStorage(
  keyOrKeyMap: GetItemFromStorageKey | Map<GetItemFromStorageKey, true>
) {
  if (typeof window !== "undefined") {
    try {
      Object.keys(localStorage)
        .filter((filterKey) => {
          if (typeof keyOrKeyMap === "string") {
            return filterKey?.includes(keyOrKeyMap);
          }
          return (
            filterKey && keyOrKeyMap.has(filterKey as GetItemFromStorageKey)
          );
        })
        .forEach((finalKey) => localStorage.removeItem(finalKey));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }
}

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
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
      console.error(error);
      Sentry.captureException(error);
    }
  };
  return [storedValue, setValue, removeItemInStorage] as const;
}
