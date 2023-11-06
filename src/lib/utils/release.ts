import { CONFIG } from "lib/config";

import {
  getItemFromStorage,
  saveItemInStorage
} from "./hooks/localstorage/useLocalStorage";

export const didReleaseVersionChange = (): boolean => {
  const releaseVersion = getItemFromStorage("release-version", undefined);
  const currentReleaseVersion = CONFIG.releaseTag;
  return releaseVersion !== currentReleaseVersion;
};

export const saveCurrentReleaseVersion = (): void => {
  const currentReleaseVersion = CONFIG.releaseTag;
  if (currentReleaseVersion) {
    saveItemInStorage("release-version", currentReleaseVersion);
  }
};
