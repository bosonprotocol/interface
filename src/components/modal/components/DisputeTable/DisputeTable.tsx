import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { TableHeaderFields } from "./const";
import TableElement from "./TableElement";

const Table = styled.table`
  min-width: 1300px;
  width: 100%;
  td {
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  color: ${colors.greyDark};
  font-size: 1.1rem;
  font-weight: 600;
  font-family: inherit;
  border-bottom: none;
  padding-bottom: 0;
  &:last-child {
    text-align: right;
  }
`;

const TableElementContainer = styled.tr`
  position: relative;
  &:after {
    position: absolute;
    background: ${colors.greyLight};
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.125rem;
  }
`;

function DisputeTable({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <Table>
      <thead>
        <tr>
          {TableHeaderFields.map((header) => {
            return (
              <TableHeader key={`TableHeader_${header.value}`} {...header}>
                {header.label}
              </TableHeader>
            );
          })}
        </tr>
      </thead>
      <tbody>
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
