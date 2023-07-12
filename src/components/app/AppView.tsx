import { ReactNode } from "react";

import { CONFIG } from "../../lib/config";
import { ViewMode } from "../../lib/viewMode";
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
  const isDapp =
    CONFIG.viewMode.current === ViewMode.DAPP ||
    (CONFIG.viewMode.current === ViewMode.BOTH &&
      location.href.startsWith(`${location.origin}/#/${ViewMode.DAPP}`));

  return isDapp ? (
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
