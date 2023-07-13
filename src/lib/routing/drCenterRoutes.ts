import { CONFIG } from "../config";
import { addViewModePrefixToPaths, ViewMode } from "../viewMode";
import { UrlParameters } from "./parameters";
const viewMode = CONFIG.envViewMode;

export const DrCenterRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DR_CENTER,
  {
    Root: "/",
    Chat: "/chat",
    DisputeId: `/exchange/:${UrlParameters.exchangeId}/raise-dispute`,
    Error404: "*"
  } as const
);
