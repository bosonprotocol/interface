import * as Select from "@radix-ui/react-select";
import styled, { css } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { boxShadow, transition } from "../ui/styles";

export const SelectTrigger = styled(Select.SelectTrigger)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  gap: 0.25rem;
  background-color: ${colors.lightGrey};
  color: ${colors.secondary};
  border: 1px solid ${colors.border};

  ${transition}
  :hover,
  :focus {
    border: 1px solid ${colors.secondary};
  }
  [data-placeholder]: {
    color: ${colors.secondary};
  }
`;

export const SelectIcon = styled(Select.SelectIcon)`
  color: ${colors.darkGrey};
  line-height: 1;
  :hover {
    color: ${colors.secondary};
  }
`;

export const StyledContent = styled(Select.Content)`
  overflow: hidden;
  background-color: ${colors.white};
  ${boxShadow};
`;

export const SelectViewport = styled(Select.Viewport)`
  padding: 0.25rem;
`;

export const SelectItem = styled(Select.Item)`
  all: unset;
  font-size: 0.75rem;
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 0.15rem 0.75rem;
  position: relative;
  cursor: pointer;

  ${transition}

  :disabled,
  [data-disabled] {
    color: ${colors.lightGrey};
    pointer-events: none;
  }

  background-color: ${colors.white};
  color: ${colors.black};
  :focus,
  :hover {
    background-color: ${colors.lightGrey};
    color: ${colors.secondary};
  }

  /* prettier-ignore */
  &[data-state=checked] {
    background-color: ${colors.lightGrey};
    color: ${colors.secondary};
    font-weight: bold;
  }
`;

export const SelectLabel = styled(Select.Label)`
  padding: 0.15rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${colors.primary};
`;

export const SelectSeparator = styled(Select.Separator)`
  height: 1px;
  background-color: ${colors.border};
  margin: 0.25rem;
`;

const scrollButtonStyles = css`
  padding: 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: ${colors.darkGrey};
  cursor: default;
`;

export const SelectScrollUpButton = styled(Select.ScrollUpButton)`
  ${scrollButtonStyles}
`;

export const SelectScrollDownButton = styled(Select.ScrollDownButton)`
  ${scrollButtonStyles}
`;

export const SelectPrimitive = Select;
export const SelectRoot = Select.Root;
export const SelectValue = Select.Value;
export const SelectGroup = Select.Group;
export const SelectItemText = Select.ItemText;
