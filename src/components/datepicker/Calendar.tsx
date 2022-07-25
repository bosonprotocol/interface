import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import {
  CalendarCell,
  CalendarDay,
  CalendarHeader,
  CalendarRow
} from "./DatePicker.style";
import { getRows, ICalendarCell } from "./utils";

export interface Props {
  date: Dayjs;
  shownDate: string;
  onChange: (newDate: Dayjs) => void;
}

export default function Calendar({ date, shownDate, onChange }: Props) {
  const selected = dayjs(shownDate);
  const handleSelectDate = (value: Dayjs) => onChange(value);

  const rows = useMemo((): Array<ICalendarCell[]> => getRows(date), [date]);

  return (
    <>
      <CalendarHeader>
        {rows[0].map(({ value }: ICalendarCell, headerIndex: number) => (
          <CalendarCell key={`calendar_header_cell_${headerIndex}`}>
            {value.format("dd")}
          </CalendarCell>
        ))}
      </CalendarHeader>
      {rows.map((cells: ICalendarCell[], rowIndex: number) => (
        <CalendarRow key={`calendar_row_${rowIndex}`}>
          {cells.map(({ text, value, current }: ICalendarCell, i: number) => (
            <CalendarDay
              key={`calendar_row_day${text}-${i}`}
              active={value.isSame(selected, "day")}
              current={current}
              onClick={() => handleSelectDate(value)}
            >
              <span>{text}</span>
            </CalendarDay>
          ))}
        </CalendarRow>
      ))}
    </>
  );
}
