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
  onChange?: (selected: Dayjs) => void;
  error?: string;
  period?: boolean;
  [x: string]: any;
}

export default function DatePicker({ onChange, ...props }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [date, setDate] = useState<Dayjs>(dayjs());
  const [shownDate, setShownDate] = useState<string>(
    date.format(CONFIG.dateFormat)
  );
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => {
    setShow(!show);
  };
  const handleDate = (v: Dayjs) => {
    setDate(v);
    setShownDate(v.format(CONFIG.dateFormat));
    onChange?.(v);
  };

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
        <SelectMonth date={date} setDate={setDate} />
        <Calendar date={date} shownDate={shownDate} onChange={handleDate} />
      </DatePickerWrapper>
    </Picker>
  );
}
