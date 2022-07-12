import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import OfferDetailPopper from "./OfferDetailPopper";

interface Props {
  name: React.ReactNode | string;
  info?: React.ReactNode | string;
  value: React.ReactNode | string;
}

interface IOfferDetailTable {
  align?: boolean;
  data: Array<Props>;
}

const Table = styled.table`
  width: 100%;
  p {
    margin: 0;
  }
  button {
    padding: 0 0.5rem !important;
  }

  tr {
    td {
      padding: 0.25rem 0;

      color: ${colors.darkGrey};
      font-family: "Plus Jakarta Sans";
      font-style: normal;
      font-size: 16px;
      line-height: 150%;

      &:first-child {
        width: 70%;
        font-weight: 600;
      }
      &:last-child {
        width: 30%;
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

const OfferDetailTable: React.FC<IOfferDetailTable> = ({ align, data }) => {
  return (
    <Table>
      <tbody>
        {data?.map((d: Props, index: number) => (
          <tr key={`tr_${index}`}>
            <td>
              <Grid justifyContent="flex-start">
                {d.name}
                {d.info && <OfferDetailPopper>{d.info}</OfferDetailPopper>}
              </Grid>
            </td>
            <td>
              <Grid justifyContent={align ? "flex-start" : "flex-end"}>
                {d.value}
              </Grid>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OfferDetailTable;
