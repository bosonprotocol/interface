import { CONFIG } from "../config";
import { addViewModePrefixToPaths, ViewMode } from "../viewMode";
import { UrlParameters } from "./parameters";
const viewMode = CONFIG.viewMode;

export const DrCenterRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DR_CENTER,
  {
    Root: "/",
    DisputeId: `/exchange/:${UrlParameters.exchangeId}/raise-dispute`,
    DisputeCenter: "/dispute-center",
    Error404: "*"
  } as const
);
