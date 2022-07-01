import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  width: 100%;

  :enabled {
    cursor: pointer;
  }
  :disabled {
    cursor: not-allowed;
  }

  ${breakpoint.m} {
    width: unset;
  }
`;
