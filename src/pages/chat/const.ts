import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";
import { getCurrentViewMode, ViewMode } from "../../lib/viewMode";

const currentViewMode = getCurrentViewMode();
export const chatUrl =
  currentViewMode === ViewMode.DAPP ? BosonRoutes.Chat : DrCenterRoutes.Chat;
