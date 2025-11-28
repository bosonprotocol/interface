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
  path: `/${string}`
): string {
  const origin = getOrigin();
  const dappViewModeUrl =
    CONFIG.envViewMode.dappViewModeUrl === "same_origin" ||
    !CONFIG.envViewMode.dappViewModeUrl
      ? origin
      : CONFIG.envViewMode.dappViewModeUrl;
  const drCenterViewModeUrl =
    CONFIG.envViewMode.drCenterViewModeUrl === "same_origin" ||
    !CONFIG.envViewMode.drCenterViewModeUrl
      ? origin
      : CONFIG.envViewMode.drCenterViewModeUrl;

  return `${
    viewMode === ViewMode.DAPP ? dappViewModeUrl : drCenterViewModeUrl
  }#${path}`;
}

export function goToViewMode(
  viewMode: ViewMode.DAPP | ViewMode.DR_CENTER,
  path: `/${string}`
): void {
  const url = getViewModeUrl(viewMode, path);
  window.location.href = url;
}

export function getCurrentViewMode() {
  const isDapp =
    CONFIG.envViewMode.current === ViewMode.DAPP ||
    (CONFIG.envViewMode.current === ViewMode.BOTH &&
      location.href.startsWith(`${getOrigin()}/#/${ViewMode.DAPP}`));
  return isDapp ? ViewMode.DAPP : ViewMode.DR_CENTER;
}

function getOrigin(): string {
  let origin = window.location.origin;
  try {
    // use document.URL to get origin: useful when serving dapp locally with the prod build
    const documentOrigin = document.URL.substring(
      0,
      document.URL.indexOf("/#/")
    );
    if (documentOrigin.startsWith(origin)) {
      origin = documentOrigin;
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (origin === window.location.origin) {
      origin = `${origin}`;
    }
  }
  return origin;
}
