import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Grid } from "../../ui/Grid";
import { GridContainer } from "../../ui/GridContainer";
import { Typography } from "../../ui/Typography";

export const OfferImage = styled.div`
  width: 3rem;
  height: 3rem;
  > div {
    padding-top: 0;
    height: 100%;
  }
  margin-right: 1rem;
`;

export const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`;

export const ExchangeName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

export const ItemsName = styled(Grid)`
  cursor: pointer;
  border-bottom: 2px solid ${colors.border};
  margin: -1rem -1rem 1rem -1rem;
  width: calc(100% + 2rem);
  padding: 1rem;
  * {
    transition: color 150ms ease-in-out;
  }
  svg {
    transition: all 150ms ease-in-out;
  }
  &:hover {
    * {
      color: ${colors.violet};
    }
    svg {
      margin-right: 0.5rem;
    }
  }
  align-items: center;
  justify-content: space-between;
`;
export const Items = styled(Grid)`
  > div {
    width: 100%;
    &:not(:last-child) {
      border-bottom: 1px solid ${colors.border};
      padding-bottom: 1rem;
    }
  }
`;
export const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 1rem;
`;

export const ItemsDates = styled(Typography)`
  padding: 0;
  justify-content: space-between;
  &:first-child {
    margin-top: 0.5rem;
  }
  &:last-child:not(:first-child) {
    margin-top: 0.25rem;
  }
  > * {
    font-size: 0.75rem;
    color: ${colors.greyDark};
    &:first-child {
      font-weight: 600;
    }
  }
`;

export const DashboardBaseInfo = styled(GridContainer)`
  grid-column-gap: 0rem;
  grid-row-gap: 0rem;
  > div {
    height: 100%;
    justify-content: flex-start;
    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const BaseElement = styled(Grid)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0;
  padding: 1rem;
`;

export const SellerInner = styled.div<{
  background?: string;
  color?: string;
  padding?: string;
}>`
  background: ${({ background }) => background || colors.white};
  color: ${({ color }) => color || colors.black};
  padding: ${({ padding }) => padding || "1rem"};
  box-shadow:
    0px 0px 5px 0px rgb(0 0 0 / 2%),
    0px 0px 10px 0px rgb(0 0 0 / 2%),
    0px 0px 15px 0px rgb(0 0 0 / 5%);
`;
