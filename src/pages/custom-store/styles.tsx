import styled from "styled-components";

import { Typography } from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

export const Section = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 0.945rem;
  text-transform: uppercase;
  padding: 0.8125rem 0;
  color: ${colors.greyLight4};
`;

export const FieldTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 150%;
  font-feature-settings:
    "zero" on,
    "ordn" on;
`;

export const FieldDescription = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 150%;
  font-feature-settings: "zero" on;
  color: ${colors.greyDark};
`;
export const gapBetweenInputs = "2rem";
export const subFieldsMarginLeft = "4rem";
export const gap = "0.5rem";
export const firstSubFieldBasis = "15%";
export const secondSubFieldBasis = "85%";
export const logoSize = 15;
