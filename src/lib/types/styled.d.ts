// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    accentActive: string;
    accentActiveSoft: string;
    accentColor: string;
    accentCritical: string;
    accentFailure: string;
    accentFailureSoft: string;
    accentWarning: string;
    accentWarningSoft: string;
    background: string;
    backgroundBackdrop: string;
    backgroundInteractive: string;
    backgroundModule: string;
    backgroundOutline: string;
    deprecated_bg3: string;
    deprecated_primary3: string;
    deprecated_text4: string;
    hoverDefault: string;
    shadow1: string;
    textPrimary: string;
    textTertiary: string;
    userThemeColor: string;
  }
}

// source: https://styled-components.com/docs/api#create-a-declarations-file
