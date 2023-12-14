import { defaultFontFamily } from "lib/styles/fonts";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import Grid from "../../ui/Grid";

export const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;

  padding: 0.45rem 1.5rem;
  max-height: 2.5rem;
  background: ${colors.border};
`;

export const Input = styled.input`
  width: 100%;
  background: transparent;
  border: 0px solid ${colors.border};

  font-family: ${defaultFontFamily};
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;

  &:focus {
    outline: none;
  }
`;

export const SearchFilterWrapper = styled.div`
  max-width: 34.1rem;
  min-width: 20rem;
`;
