import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

import DatePicker from "../../datepicker/DatePicker";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

export default function ExportExchangesWithDeliveryModal({
  onExport
}: {
  onExport: (from?: Dayjs) => void;
}) {
  const today = useMemo(() => dayjs(), []);
  const [from, setFrom] = useState<Dayjs | null>(today);
  const initialDate = useMemo(() => dayjs().startOf("month"), []);
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="5rem">
      <Grid flexDirection="column" alignItems="flex-start" gap="0.5rem">
        <Typography tag="h4">Option 1</Typography>
        <p>
          You can choose to export <strong>only</strong> the exchanges with
          delivery information from a specific date. This option is useful if
          you have a rough idea of when the delivery information was sent in the
          chat conversation.
        </p>
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography tag="div">From date:</Typography>
          <Grid gap="0.5rem">
            <DatePicker
              period={false}
              selectTime
              minDate={null}
              maxDate={today}
              initialValue={initialDate}
              onChange={(date) => {
                setFrom(date as Dayjs);
              }}
            />
            <BosonButton
              disabled={!from}
              onClick={() => onExport(from as Dayjs)}
            >
              Export
            </BosonButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h4">Option 2</Typography>
        <p>
          Alternatively, you can export <strong>all</strong> your exchanges
          using the redemption date for each exchange as the origin date for the
          delivery information.This option will always include, if it exists in
          the chat conversation, the delivery information.
        </p>
        <BosonButton onClick={() => onExport()}>Export</BosonButton>
      </Grid>
    </Grid>
  );
}
