import styled from "styled-components";

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

  @media (min-width: 981px) {
    width: unset;
  }
`;
