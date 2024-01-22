import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { ChatDots, CheckCircle } from "phosphor-react";
import styled from "styled-components";

import { ContainerProductPage, ProductButtonGroup } from "../Product.styles";

export const ConfirmProductDetailsContainer = styled(ContainerProductPage)`
  ${breakpoint.m} {
    max-width: unset;
  }
`;

export const CollapseContainer = styled.div`
  padding: 1.5rem 2rem;
  background: ${colors.lightGrey};
  &:nth-of-type(2) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  h3 {
    margin: 0;
  }
  button {
    div {
      display: flex;
    }
  }
`;

export const ConfirmationAlert = styled.div`
  padding: 1.5rem 1.5rem 1.5rem 1.625rem;
  background: ${colors.black};
  margin-top: 2rem;
  display: flex;
  color: ${colors.white};
  align-items: center;
`;

export const IconWrapper = styled.div`
  width: 3.125rem;
  > svg {
    color: ${colors.green};
  }
`;

export const ConfirmationContent = styled.div`
  width: calc(100% - 3.125rem);
  p {
    margin: 0;
    line-height: 1.5rem;
  }
  p:first-child {
    font-weight: 600;
  }
`;

export const ConfirmProductDetailsButtonGroup = styled(ProductButtonGroup)`
  margin: 0;
`;

export const GridBox = styled.div<{ $minWidth?: string }>`
  min-width: ${({ $minWidth }) => ($minWidth ? $minWidth : "auto")};
`;

export const ProductTypeBox = styled(GridBox)`
  margin-bottom: 2rem;
  &:not(:last-child) {
    padding-right: 1.5rem;
  }
`;

export const ContentValue = styled(Typography)`
  font-size: 0.75rem;
  color: ${colors.darkGrey};
  word-break: break-all;
  white-space: pre-wrap;
  gap: 0.5rem;
`;

export const FormFieldContainer = styled.div`
  margin-bottom: 2rem;
  > div {
    margin-bottom: 0;
  }
  p,
  [data-header] {
    font-size: 0.75rem;
    margin: 0;
  }
`;

export const ProductInformationContent = styled.div`
  padding: 1rem 0 0 0;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

export const TermsOfSaleContent = styled.div`
  padding-top: 2.25rem;
`;

export const ProductBox = styled.div`
  border: 1px solid ${colors.border};
  padding-top: 1rem;
  text-align: center;
  width: 6.313rem;
  height: 6.625rem;
  p {
    display: block;
    font-size: 0.625rem;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

export const ProductSubtitle = styled(Typography)`
  font-size: 1.25rem;
`;

export const TagsWrapper = styled.div`
  display: flex;
`;

export const Tag = styled.div`
  background-color: #e3e8f8;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  span {
    font-size: 0.75rem;
  }
  &:not(:first-child) {
    margin-left: 0.75rem;
  }
`;

export const SpaceContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  max-width: 22rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  ${breakpoint.xs} {
    max-width: 32rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  ${breakpoint.s} {
    max-width: 42rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const InitializeChatContainer = styled.div`
  margin-top: 2rem;
`;

export const Info = styled(Grid)`
  justify-content: space-between;
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
`;

export const ChatDotsIcon = styled(ChatDots)`
  fill: var(--secondary);
  path {
    stroke: var(--secondary);
  }
`;
export const CheckIcon = styled(CheckCircle)`
  color: var(--secondary);
  path {
    stroke: var(--secondary);
  }
`;

export const InfoMessage = styled(Typography)`
  line-height: 1.5rem;
  letter-spacing: 0px;
  text-align: left;
  flex: 1 1;
`;
