import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
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
  color: ${colors.darkGrey};
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
    label: "ID",
    value: -1,
    colspan: 1
  },
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
    label: "Days left to resolve dispute",
    value: 2,
    colspan: 3
  },
  {
    label: "Resolution summary",
    value: 3,
    colspan: 3
  },
  {
    label: "Actions",
    value: 4,
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
