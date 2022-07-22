import { Dayjs } from "dayjs";
import React, { useCallback, useMemo } from "react";

import {
  CalendarCell,
  CalendarDay,
  CalendarHeader,
  CalendarRow
} from "./DatePicker.style";
import { getRows, ICalendarCell } from "./utils";

export interface Props {
  date: Dayjs;
  onChange: (newDate: Dayjs) => void;
}

export default function Calendar({ date, onChange }: Props) {
  // TODO: change month
  const handleSelectDate = useCallback(
    (value: Dayjs) => onChange(value),
    [onChange]
  );

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
          {cells.map(
            ({ text, value, active, current }: ICalendarCell, i: number) => (
              <CalendarDay
                key={`calendar_row_day${text}-${i}`}
                active={active}
                current={current}
                onClick={() => handleSelectDate(value)}
              >
                <span>{text}</span>
              </CalendarDay>
            )
          )}
        </CalendarRow>
      ))}
    </>
  );
}
