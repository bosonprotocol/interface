import Grid from "../ui/Grid";
import { Table } from "./Detail.style";
import DetailPopper from "./DetailPopper";

interface Data {
  name: React.ReactNode | string;
  info?: React.ReactNode | string;
  value: React.ReactNode | string;
}

interface Props {
  align?: boolean;
  data: Array<Data>;
  noBorder?: boolean;
}

export default function DetailTable({ align, data, noBorder = false }: Props) {
  return (
    <Table noBorder={noBorder}>
      <tbody>
        {data?.map((d: Data, index: number) => (
          <tr key={`tr_${index}`}>
            <td>
              <Grid justifyContent="flex-start">
                {d.name}
                {d.info && <DetailPopper>{d.info}</DetailPopper>}
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
}
