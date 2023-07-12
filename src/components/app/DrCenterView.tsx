import { ReactNode } from "react";

import GlobalStyle from "../../lib/styles/GlobalStyle";
import { DrCenterFooter } from "../footer/DrCenterFooter";
import { DrCenterHeader } from "../header/DrCenterHeader";
import { Wrapper } from "./useWrapper";

type DrCenterViewProps = {
  wrapper: Wrapper;
  children: ReactNode;
  withHeader?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
};

export const DrCenterView: React.FC<DrCenterViewProps> = ({
  wrapper: Wrapper,
  children,
  withFooter,
  withHeader,
  fluidHeader
}) => {
  return (
    <>
      <GlobalStyle />
      {withHeader && <DrCenterHeader fluidHeader={fluidHeader} />}
      <Wrapper>{children}</Wrapper>
      {withFooter && <DrCenterFooter />}
    </>
  );
};
