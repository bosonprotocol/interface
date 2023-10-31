import styled, { css } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { transition } from "../ui/styles";

const CrossIcon = (props: Record<string, unknown>) => (
  <svg
    height="20"
    width="20"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
  </svg>
);
export const ClearButton = styled(CrossIcon)`
  position: absolute;
  background-color: ${colors.lightGrey};
  top: 0;
  right: 0;
  height: 100%;
  margin: 0 5px;
  cursor: pointer;
  display: inline-block;
  fill: #cccccc;
  line-height: 1;
  stroke: #cccccc;
  stroke-width: 0;
  :hover * {
    stroke: #999999;
    fill: #999999;
  }
`;
export const Picker = styled.div`
  width: 100%;
  position: relative;
  :hover,
  :focus-within {
    ${ClearButton} {
      display: initial;
    }
  }
`;
export const PickerGrid = styled.div.attrs(
  (props: { selectTime: boolean }) => ({
    selectTime: props.selectTime
  })
)`
  width: 100%;
  display: grid;
  gap: 0px 1em;
  ${({ selectTime }) =>
    selectTime
      ? css`
          grid-template-columns: 1fr 1fr;
        `
      : css`
          grid-template-columns: 1fr;
        `}
`;

export const DatePickerWrapper = styled.div.attrs(
  (props: { show: boolean; selectTime: boolean }) => ({
    show: props.show,
    selectTime: props.selectTime
  })
)`
  position: absolute;
  bottom: 0;
  left: 0;
  background: ${colors.white};
  z-index: ${zIndex.Calendar};
  transform: translate(0, calc(100% + 0.5rem));

  &:before {
    position: absolute;
    content: "";
    width: 0;
    height: 0;

    top: -0.5rem;
    left: 50%;
    transform: translate(-50%, 0);
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid ${colors.white};
  }

  ${({ show }) =>
    show
      ? css`
          display: block;
        `
      : css`
          display: none;
        `}

  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.05), 0px 0px 8px rgba(0, 0, 0, 0.05),
    0px 0px 16px rgba(0, 0, 0, 0.05), 0px 0px 32px rgba(0, 0, 0, 0.05);

  padding: 0.5rem;
  width: 100%;
  ${({ selectTime }) =>
    selectTime
      ? css`
          width: 36rem;
        `
      : css`
          width: 18rem;
        `}
`;

export const Selector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.border};
`;

const CalendarFlex = styled.div`
  display: flex;
  > div {
    flex: 1;
  }
`;

export const CalendarRow = styled.div`
  display: grid;
  grid-column-gap: 0;
  grid-row-gap: 0;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

export const CalendarHeader = styled(CalendarFlex)`
  margin-bottom: 0.5rem;
  > div {
    color: ${colors.darkGrey};
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

export const CalendarCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
`;

export const CalendarDay = styled(CalendarCell).attrs(
  (props: {
    active: boolean;
    current: boolean;
    between: boolean;
    disabled: boolean;
  }) => ({
    active: props.active,
    current: props.current,
    between: props.between,
    disabled: props.disabled
  })
)`
  cursor: pointer;
  position: relative;
  ${transition}
  > span {
    z-index: 3;
  }

  :after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${colors.lightGrey};
    border-radius: 50%;
    width: 0;
    height: 0;
    z-index: 1;

    ${transition}
  }

  :hover {
    :after {
      width: 2rem;
      height: 2rem;
    }
  }
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.25;
      cursor: not-allowed;
    `}

  ${({ current }) =>
    !current &&
    css`
      span {
        opacity: 0.5;
      }
    `}

  ${({ active }) =>
    active &&
    css`
      :after {
        background: ${colors.secondary};
        width: 2.25rem;
        height: 2.25rem;
        z-index: 2;
      }
      span {
        color: ${colors.white};
        font-weight: 600;
      }
    `}
  ${({ active, between }) =>
    between &&
    !active &&
    css`
      :after {
        background: ${colors.secondary};
        width: 1.75rem;
        height: 1.75rem;
        z-index: 2;
        opacity: 0.5;
      }
      span {
        color: ${colors.white};
        font-weight: 600;
      }
    `}
`;
