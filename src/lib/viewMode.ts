import { CONFIG } from "./config";

export enum ViewMode {
  DAPP = "dapp",
  DR_CENTER = "dr_center",
  BOTH = "dapp,dr_center"
}

export function addViewModePrefixToPaths<T extends Record<string, string>>(
  currentViewMode: ViewMode,
  viewModeToPrefix: ViewMode.DAPP | ViewMode.DR_CENTER,
  paths: T
): T {
  if (currentViewMode !== ViewMode.BOTH) {
    return paths;
  }
  return Object.entries(paths).reduce((acum, [key, value]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acum[key] = `/${viewModeToPrefix}${value === "*" ? "/*" : value}`;
    return acum;
  }, {} as T);
}

export function getViewModeUrl(
  viewMode: ViewMode.DAPP | ViewMode.DR_CENTER,
  path: string
): string {
  const dappViewModeUrl =
    CONFIG.viewMode.dappViewModeUrl === "same_origin" ||
    !CONFIG.viewMode.dappViewModeUrl
      ? window.location.origin
      : CONFIG.viewMode.dappViewModeUrl;
  const drCenterViewModeUrl =
    CONFIG.viewMode.drCenterViewModeUrl === "same_origin" ||
    !CONFIG.viewMode.drCenterViewModeUrl
      ? window.location.origin
      : CONFIG.viewMode.drCenterViewModeUrl;
  return `${
    viewMode === ViewMode.DAPP ? dappViewModeUrl : drCenterViewModeUrl
  }/#${path}`;
}

export function goToViewMode(
  viewMode: ViewMode.DAPP | ViewMode.DR_CENTER,
  path: string
): void {
  const url = getViewModeUrl(viewMode, path);
  window.location.href = url;
}
