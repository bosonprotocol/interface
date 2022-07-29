import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import React, { useMemo } from "react";

import {
  CalendarCell,
  CalendarDay,
  CalendarHeader,
  CalendarRow
} from "./DatePicker.style";
import { getRows, ICalendarCell } from "./utils";

export interface Props {
  date: Dayjs | null;
  secondDate: Dayjs | null;
  month: Dayjs;
  period: boolean;
  onChange: (newDate: Dayjs) => void;
}

export default function Calendar({
  date,
  secondDate,
  month,
  period,
  onChange
}: Props) {
  const firstDay = date ? dayjs(date) : null;
  const secondDay = secondDate ? dayjs(secondDate) : null;
  const handleSelectDate = (value: Dayjs) => {
    if (!period || (period && !value.isBefore(firstDay, "day"))) {
      onChange(value);
    }
  };

  const rows = useMemo((): ICalendarCell[] => getRows(month), [month]);

  return (
    <>
      <CalendarHeader>
        {rows
          .slice(0, 7)
          .map(({ value }: ICalendarCell, headerIndex: number) => (
            <CalendarCell key={`calendar_header_cell_${headerIndex}`}>
              {value.format("dd")}
            </CalendarCell>
          ))}
      </CalendarHeader>
      <CalendarRow>
        {rows.map(({ text, value, current }: ICalendarCell, i: number) => {
          const disabled = period ? value.isBefore(firstDay, "day") : false;
          return (
            <CalendarDay
              key={`calendar_row_day${text}-${i}`}
              active={
                secondDate
                  ? value.isSame(firstDay, "day") ||
                    value.isSame(secondDay, "day")
                  : value.isSame(firstDay, "day")
              }
              between={
                secondDate ? value.isBetween(firstDay, secondDay, "day") : false
              }
              disabled={disabled}
              current={current}
              onClick={() => handleSelectDate(value)}
            >
              <span>{text}</span>
            </CalendarDay>
          );
        })}
      </CalendarRow>
    </>
  );
}
