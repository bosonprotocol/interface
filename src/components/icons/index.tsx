import { colors } from "lib/styles/colors";
import { X } from "phosphor-react";
import styled from "styled-components";

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-width: 0;
  margin: 0;
  background-color: ${colors.lightGrey};
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.lightGrey};
`;
