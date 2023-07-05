import { CONFIG } from "../config";
import { addViewModePrefixToPaths, ViewMode } from "../viewMode";
const viewMode = CONFIG.viewMode;

export const DrCenterRoutes = addViewModePrefixToPaths(
  viewMode,
  ViewMode.DR_CENTER,
  {
    Root: "/",
    Error404: "*"
  } as const
);
