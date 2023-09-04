import styled from "styled-components";

import { colors } from "./colors";

export const PreventCustomStoreStyles = styled.div`
  --headerBgColor: ${colors.white};
  --headerTextColor: ${colors.darkGrey};
  --primary: ${colors.primary};
  --secondary: ${colors.lightGrey};
  --accent: ${colors.accent};
  --accentNoDefault: initial;
  --accentDark: ${colors.arsenic};
  --textColor: ${colors.black};
  --primaryBgColor: ${colors.primaryBgColor};
  --secondaryBgColor: ${colors.secondary};
  --footerBgColor: ${colors.black};
  --footerTextColor: ${colors.white};
  --buttonBgColor: ${colors.primary};
  --buttonTextColor: ${colors.black};
  --upperCardBgColor: ${colors.white};
  --lowerCardBgColor: ${colors.white};

  color: ${colors.black};
`;
