import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import TableElement from "./TableElement";

const Table = styled.table`
  width: 100%;
  td {
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding-top: 1.5625rem;
  color: ${colors.darkGrey};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  border-bottom: none;
  padding-bottom: 0;
  :last-child {
    text-align: right;
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
    width: 100%;
    height: 0.125rem;
  }
`;

const TableHeaderFields = [
  {
    label: "Exchange",
    value: 0,
    colspan: 1
  },
  {
    label: "Dispute status",
    value: 1,
    colspan: 3
  },
  {
    label: "Resolution summary",
    value: 2,
    colspan: 3
  },
  {
    label: "Actions",
    value: 3,
    colspan: 3
  }
];

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
