import { Fragment } from "react";

import Tooltip from "../tooltip/Tooltip";
import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import { Table } from "./Detail.style";

export interface Data {
  hide?: boolean | undefined;
  name?: React.ReactNode | string;
  info?: React.ReactNode | string;
  value?: React.ReactNode | string;
  nextLine?: React.ReactNode | string;
}

interface Props {
  align?: boolean;
  data: Readonly<Array<Data>>;
  noBorder?: boolean;
  inheritColor?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export default function DetailTable({
  align,
  data,
  noBorder = false,
  inheritColor = false,
  tag = "span"
}: Props) {
  return (
    <Table noBorder={noBorder} $inheritColor={inheritColor}>
      <tbody>
        {data?.map(
          ({ hide = false, ...d }: Data, index: number) =>
            !hide && (
              <Fragment key={`tr_fragment_${index}`}>
                <tr>
                  <td>
                    <Grid justifyContent="flex-start">
                      <Typography tag={tag}>{d.name}</Typography>
                      {d.info && <Tooltip content={d.info} size={20} />}
                    </Grid>
                  </td>
                  <td>
                    <Grid justifyContent={align ? "flex-start" : "flex-end"}>
                      {d.value}
                    </Grid>
                  </td>
                </tr>
                {d.nextLine ? (
                  <tr>
                    <td key={`tr_${index}_next`} colSpan={2}>
                      {d.nextLine}
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </Fragment>
            )
        )}
      </tbody>
    </Table>
  );
}
