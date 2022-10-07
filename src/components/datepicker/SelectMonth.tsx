import { Button } from "@bosonprotocol/react-kit";
import type { Dayjs } from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useCallback } from "react";

import Typography from "../ui/Typography";
import { Selector } from "./DatePicker.style";
import { changeMonth } from "./utils";

interface Props {
  month: Dayjs;
  setMonth: React.Dispatch<React.SetStateAction<Dayjs>>;
}

export default function SelectMonth({ month, setMonth }: Props) {
  const handleMonthChange = useCallback(
    (isNext: boolean) => setMonth(changeMonth(month, isNext)),
    [setMonth, month]
  );

  return (
    <Selector>
      <Button
        variant="accentInverted"
        showBorder={false}
        onClick={() => handleMonthChange(false)}
      >
        <CaretLeft size={18} />
      </Button>
      <Typography tag="p">{month.format("MMMM YYYY")}</Typography>
      <Button
        variant="accentInverted"
        showBorder={false}
        onClick={() => handleMonthChange(true)}
      >
        <CaretRight size={18} />
      </Button>
    </Selector>
  );
}
