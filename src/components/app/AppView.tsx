import { ReactNode } from "react";

import { getCurrentViewMode, ViewMode } from "../../lib/viewMode";
import { DappView } from "./DappView";
import { DrCenterView } from "./DrCenterView";
import { Wrapper } from "./useWrapper";

type AppViewProps = {
  wrapper: Wrapper;
  children: ReactNode;
  withHeader?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
  withBosonStyles?: boolean;
};

export const AppView: React.FC<AppViewProps> = ({
  wrapper: Wrapper,
  children,
  fluidHeader,
  withBosonStyles,
  withFooter,
  withHeader
}) => {
  const currentViewMode = getCurrentViewMode();

  return currentViewMode === ViewMode.DAPP ? (
    <DappView
      wrapper={Wrapper}
      fluidHeader={fluidHeader}
      withBosonStyles={withBosonStyles}
      withFooter={withFooter}
      withHeader={withHeader}
    >
      {children}
    </DappView>
  ) : (
    <DrCenterView
      wrapper={Wrapper}
      fluidHeader={fluidHeader}
      withFooter={withFooter}
      withHeader={withHeader}
    >
      {children}
    </DrCenterView>
  );
};
