import React from "react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import TableElement from "./TableElement";

const Table = styled.table`
  width: 100%;
  max-width: 65.625rem;
  margin: 0 auto;
  td {
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
`;

const TableHeader = styled.td`
  padding-top: 1.5625rem;
  color: ${colors.darkGrey};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  border-bottom: none;
  padding-bottom: 0;
`;

const TableElementContainer = styled.tr`
  position: relative;
  :after {
    position: absolute;
    background: ${colors.darkGreyTimeStamp};
    content: "";
    left: 0;
    bottom: 0;
    width: calc(100% - 2.0625rem);
    height: 0.125rem;
  }
`;

const TableHeaderFields = [
  {
    label: "Product",
    value: 0
  },
  {
    label: "State",
    value: 1
  },
  {
    label: "",
    value: 2
  },
  {
    label: "",
    value: 3
  },
  {
    label: "",
    value: 4
  }
];

function DisputeTable({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <Table>
      <tbody>
        <tr>
          {TableHeaderFields.map((header) => {
            return <TableHeader key={header.value}>{header.label}</TableHeader>;
          })}
        </tr>
        {exchanges.map((exchange) => {
          return (
            <TableElementContainer key={exchange.id}>
              <TableElement exchange={exchange} />
            </TableElementContainer>
          );
        })}
      </tbody>
    </Table>
  );
}

export default DisputeTable;
