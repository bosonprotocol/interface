import { ReactNode } from "react";

import GlobalStyle from "../../lib/styles/GlobalStyle";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Footer from "../footer/Footer";
import HeaderComponent from "../header/Header";
import { Wrapper } from "./useWrapper";

type DappViewProps = {
  wrapper: Wrapper;
  children: ReactNode;
  withHeader?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
  withBosonStyles?: boolean;
};

export const DappView: React.FC<DappViewProps> = ({
  wrapper: Wrapper,
  children,
  fluidHeader,
  withBosonStyles,
  withFooter,
  withHeader
}) => {
  const headerBgColor = useCustomStoreQueryParameter("headerBgColor");
  const headerTextColor = useCustomStoreQueryParameter("headerTextColor");
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");
  const secondaryBgColor = useCustomStoreQueryParameter("secondaryBgColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");
  const textColor = useCustomStoreQueryParameter("textColor");
  const showFooterValue = useCustomStoreQueryParameter("showFooter");
  const showFooter = ["", "true"].includes(showFooterValue);
  const footerBgColor = useCustomStoreQueryParameter("footerBgColor");
  const footerTextColor = useCustomStoreQueryParameter("footerTextColor");
  const fontFamily = useCustomStoreQueryParameter("fontFamily");
  const buttonBgColor = useCustomStoreQueryParameter("buttonBgColor");
  const buttonTextColor = useCustomStoreQueryParameter("buttonTextColor");
  const upperCardBgColor = useCustomStoreQueryParameter("upperCardBgColor");
  const lowerCardBgColor = useCustomStoreQueryParameter("lowerCardBgColor");
  console.log({ headerBgColor });
  return (
    <>
      <GlobalStyle
        $withBosonStyles={withBosonStyles}
        $headerBgColor={headerBgColor}
        $headerTextColor={headerTextColor}
        $primaryBgColor={primaryBgColor}
        $secondaryBgColor={secondaryBgColor}
        $accentColor={accentColor}
        $textColor={textColor}
        $footerBgColor={showFooter ? footerBgColor : ""}
        $footerTextColor={showFooter ? footerTextColor : ""}
        $fontFamily={fontFamily}
        $buttonBgColor={buttonBgColor}
        $buttonTextColor={buttonTextColor}
        $upperCardBgColor={upperCardBgColor}
        $lowerCardBgColor={lowerCardBgColor}
      />
      {withHeader && <HeaderComponent fluidHeader={fluidHeader} />}
      <Wrapper>{children}</Wrapper>
      <Footer withFooter={withFooter} />
    </>
  );
};
