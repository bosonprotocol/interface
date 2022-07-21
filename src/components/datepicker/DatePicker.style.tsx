import styled, { css } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { transition } from "../ui/styles";

export const Picker = styled.div``;

export const DatePickerWrapper = styled.div.attrs(
  (props: { show: boolean }) => ({
    show: props.show
  })
)`
  ${({ show }) =>
    show
      ? css`
          display: block;
        `
      : css`
          display: none;
        `}

  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);

  padding: 0.5rem;
  width: 100%;
  max-width: 20rem;
`;

export const Selector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 3rem;
  padding-bottom: 0.5rem;

  border-bottom: 1px solid ${colors.border};
`;

export const CalendarFlex = styled.div`
  display: flex;
  > div {
    flex: 1;
  }
`;

export const CalendarRow = styled(CalendarFlex)``;
export const CalendarHeader = styled(CalendarFlex)`
  margin-bottom: 0.5rem;
  > div {
    color: ${colors.darkGrey};
    font-size: 0.875rem;
    font-weight: bold;
  }
`;

export const CalendarCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
`;

export const CalendarDay = styled(CalendarCell).attrs(
  (props: { active: boolean; current: boolean }) => ({
    active: props.active,
    current: props.current
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
        font-weight: bold;
      }
    `}
`;
