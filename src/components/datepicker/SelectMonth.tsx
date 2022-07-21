import type { Dayjs } from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useCallback } from "react";

import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { Selector } from "./DatePicker.style";
import { changeMonth } from "./utils";

interface Props {
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

export default function SelectMonth({ date, setDate }: Props) {
  const handleMonthChange = useCallback(
    (isNext: boolean) => setDate(changeMonth(date, isNext)),
    [setDate, date]
  );

  return (
    <Selector>
      <Button theme="blank" onClick={() => handleMonthChange(false)}>
        <CaretLeft size={18} />
      </Button>
      <Typography tag="p">{date.format("MMMM YYYY")}</Typography>
      <Button theme="blank" onClick={() => handleMonthChange(true)}>
        <CaretRight size={18} />
      </Button>
    </Selector>
  );
}
