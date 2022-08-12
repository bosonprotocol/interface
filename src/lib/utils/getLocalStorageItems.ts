type GetLocalStorageItems = {
  key: string;
  returnObjects?: boolean;
};

export function getLocalStorageItems({
  key,
  returnObjects = false
}: GetLocalStorageItems) {
  if (typeof window === "undefined") {
    return [];
  }
  return Object.keys(window.localStorage)
    .filter((item) => item.startsWith(key))
    .map((item) => {
      const value = JSON.parse(localStorage[item]);
      return returnObjects ? { value, key: item.replace(key, "") } : value;
    })
    .filter(Boolean);
}
