import { subgraph } from "@bosonprotocol/react-kit";
import styled, { css } from "styled-components";

import { colors } from "../../../lib/styles/colors";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    font-weight: 600;
    color: ${colors.darkGrey};
    :not([data-sortable]) {
      cursor: default !important;
    }
    [data-sortable] {
      cursor: pointer !important;
    }
  }
  td {
    font-weight: 400;
    color: ${colors.black};
  }
  th,
  td {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  thead {
    tr {
      th {
        border-bottom: 2px solid ${colors.border};
        text-align: left;
        padding: 0.5rem;
        &:first-child {
          padding-left: 0.5rem;
        }
        &:last-child {
          text-align: center;
        }
      }
    }
  }
  tbody {
    tr {
      :hover {
        td {
          background-color: ${colors.darkGrey}08;
          cursor: pointer;
        }
      }
      &:not(:last-child) {
        td {
          border-bottom: 1px solid ${colors.border};
        }
      }
      td {
        text-align: left;
        padding: 0.5rem;
        &:first-child {
        }
        &:last-child {
          text-align: right;
          span {
            width: 100%;
          }
          > button {
            display: inline-block;
          }
        }
        > button {
          &:not(:last-child) {
            margin-right: 0.5rem;
          }
        }
      }
    }
  }
  [data-testid="price"] {
    transform: scale(0.75);
  }
`;

export const HeaderSorter = styled.span`
  margin-left: 0.5rem;
`;

export const Pagination = styled.div`
  width: 100%;
  padding-top: 1rem;
  border-top: 2px solid ${colors.border};

  select {
    padding: 0.5rem;
    border: 1px solid ${colors.border};
    background: ${colors.white};
    margin: 0 1rem;
  }
`;

export const Span = styled.span`
  font-size: 0.75rem;
  color: ${colors.darkGrey};
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

export const DisputeStateWrapper = styled.button.attrs(
  (props: { state: subgraph.DisputeState }) => ({
    state: props.state
  })
)`
  padding: 0.4rem;
  border-radius: 5%;
  color: ${colors.black};
  ${({ state }) =>
    state === subgraph.DisputeState.Escalated &&
    css`
      background-color: ${colors.green};
    `}
  ${({ state }) =>
    state === subgraph.DisputeState.Decided &&
    css`
      background-color: ${colors.blue};
    `}
    ${({ state }) =>
    state === subgraph.DisputeState.Refused &&
    css`
      background-color: ${colors.red};
    `};
`;
