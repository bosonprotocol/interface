import { colors } from "lib/styles/colors";
import { Trash } from "phosphor-react";
import { styled } from "styled-components";

export const Delete = styled(Trash)`
  cursor: pointer;
  align-self: center;
  justify-self: center;
  border: 3px solid ${colors.border};
  padding: 0.5rem;
  border-radius: 50%;
  box-sizing: content-box;
  &:hover {
    background-color: ${colors.lightGrey};
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;

  > * {
    flex: 1 1 100%;
  }
`;
