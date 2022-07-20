import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { Table } from "./Detail.style";
import DetailPopper from "./DetailPopper";

export interface Data {
  hide?: boolean | undefined;
  name?: React.ReactNode | string;
  info?: React.ReactNode | string;
  value?: React.ReactNode | string;
}

interface Props {
  align?: boolean;
  data: Readonly<Array<Data>>;
  noBorder?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export default function DetailTable({
  align,
  data,
  noBorder = false,
  tag = "span"
}: Props) {
  return (
    <Table noBorder={noBorder}>
      <tbody>
        {data?.map(
          ({ hide = false, ...d }: Data, index: number) =>
            !hide && (
              <tr key={`tr_${index}`}>
                <td>
                  <Grid justifyContent="flex-start">
                    <Typography tag={tag}>{d.name}</Typography>
                    {d.info && <DetailPopper>{d.info}</DetailPopper>}
                  </Grid>
                </td>
                <td>
                  <Grid justifyContent={align ? "flex-start" : "flex-end"}>
                    {d.value}
                  </Grid>
                </td>
              </tr>
            )
        )}
      </tbody>
    </Table>
  );
}
