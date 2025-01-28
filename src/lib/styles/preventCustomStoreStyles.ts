import styled from "styled-components";

import { colors } from "./colors";

export const PreventCustomStoreStyles = styled.div`
  --headerBgColor: ${colors.white};
  --headerTextColor: ${colors.greyDark};
  --primary: ${colors.green};
  --secondary: ${colors.greyLight};
  --accent: ${colors.violet};
  --accentDark: ${colors.arsenic};
  --textColor: ${colors.black};
  --primaryBgColor: ${colors.white};
  --secondaryBgColor: ${colors.violet};
  --footerBgColor: ${colors.black};
  --footerTextColor: ${colors.white};
  --buttonBgColor: ${colors.green};
  --buttonTextColor: ${colors.black};
  --upperCardBgColor: ${colors.white};
  --lowerCardBgColor: ${colors.white};

  color: ${colors.black};
`;
