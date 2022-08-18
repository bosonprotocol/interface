// extracted from https://usehooks.com/useLocalStorage/
import { useState } from "react";

export function getItemFromStorage<T>(key: string, initialValue: T) {
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
      Object.entries(localStorage)
        .map((localKey) => localKey[0])
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

export function useLocalStorage<T>(key: string, initialValue: T) {
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
