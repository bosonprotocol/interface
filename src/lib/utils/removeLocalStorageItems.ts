import { removeItemInStorage } from "./hooks/useLocalStorage";
type RemoveLocalStorageItems = {
  key: string;
};

export function removeLocalStorageItems({ key }: RemoveLocalStorageItems) {
  if (typeof window === "undefined") {
    return false;
  }
  return Object.keys(window.localStorage)
    .filter((item) => item.startsWith(key))
    .map((item) => {
      try {
        removeItemInStorage(item);
      } catch (error) {
        console.error(error);
      }
    });
}
