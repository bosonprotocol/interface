/* eslint @typescript-eslint/no-explicit-any: "off" */
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import { CONFIG } from "../../lib/config";
import { FieldInput } from "../form/Field.styles";
import Calendar from "./Calendar";
import { DatePickerWrapper, Picker } from "./DatePicker.style";
import SelectMonth from "./SelectMonth";

interface Props {
  onChange?: (selected: Dayjs | Array<Dayjs | null>) => void;
  error?: string;
  period: boolean;
  [x: string]: any;
}

export default function DatePicker({ onChange, period, ...props }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [date, setDate] = useState<Dayjs | null>(null);
  const [secondDate, setSecondDate] = useState<Dayjs | null>(null);
  const [shownDate, setShownDate] = useState<string>("Choose dates...");
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleDateChange = (v: Dayjs, first: boolean) => {
    if (period) {
      if (date === null || secondDate !== null || first) {
        setDate(v);
        setSecondDate(null);
      } else {
        setSecondDate(v);
      }
    } else {
      setDate(v);
    }
  };

  useEffect(() => {
    if (period) {
      if (date !== null && secondDate !== null)
        setShownDate(
          `${date.format(CONFIG.dateFormat)} - ${secondDate?.format(
            CONFIG.dateFormat
          )}`
        );
      onChange?.([date, secondDate]);
    } else {
      if (date !== null) {
        setShownDate(date.format(CONFIG.dateFormat));
        onChange?.(date);
      }
    }
  }, [date, secondDate]); // eslint-disable-line

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clicksOn =
        ref.current && ref?.current.contains(event.target as Node);
      if (!clicksOn && show) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <Picker>
      <FieldInput value={shownDate} onClick={handleShow} {...props} />
      <DatePickerWrapper
        show={show}
        ref={(r) => {
          ref.current = r;
        }}
      >
        <SelectMonth month={month} setMonth={setMonth} />
        <Calendar
          date={date}
          secondDate={secondDate}
          month={month}
          period={period}
          onChange={handleDateChange}
        />
      </DatePickerWrapper>
    </Picker>
  );
}
