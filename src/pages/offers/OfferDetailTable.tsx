import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

interface Props {
  name: string;
  value: string;
}

interface IOfferDetailTable {
  data: Array<Props>;
}

const Table = styled.table`
  width: 100%;

  tr {
    td {
      padding: 0.25rem 0;

      color: ${colors.darkGrey};
      font-family: "Plus Jakarta Sans";
      font-style: normal;
      font-size: 16px;
      line-height: 150%;

      &:first-child {
        font-weight: 600;
      }
      &:last-child {
        font-weight: 400;
      }
    }
    &:not(:last-child) {
      td {
        border-bottom: 1px solid ${colors.border};
      }
    }
  }
`;

const OfferDetailTable: React.FC<IOfferDetailTable> = ({ data }) => {
  console.log(data);
  return (
    <Table>
      <tbody>
        {data.map((d: Props) => (
          <tr>
            <td>{d.name}</td>
            <td>{d.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OfferDetailTable;
