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
    padding-bottom: 20px;
    padding-top: 20px;
  }
  [data-table-header] {
    padding-top: 1.5625rem;
    color: ${colors.darkGrey};
    font-size: 0.75rem;
    font-weight: 600;
    font-family: "Plus Jakarta Sans";
    border-bottom: none;
    padding-bottom: 0;
  }
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
    height: 2px;
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
            return (
              <td data-table-header key={header.value}>
                {header.label}
              </td>
            );
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
