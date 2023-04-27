import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { useMemo } from "react";

import {
  CalendarCell,
  CalendarDay,
  CalendarHeader,
  CalendarRow
} from "./DatePicker.style";
import { getCalenderRow, ICalendarCell } from "./utils";

export interface Props {
  date: Dayjs | null;
  secondDate: Dayjs | null;
  month: Dayjs;
  period: boolean;
  onChange: (newDate: Dayjs | null) => void;
  minDate: Dayjs | null | undefined;
  maxDate: Dayjs | null | undefined;
}

export default function Calendar({
  date,
  secondDate,
  month,
  period,
  onChange,
  minDate,
  maxDate
}: Props) {
  const firstDay = date ? dayjs(date) : null;
  const secondDay = secondDate ? dayjs(secondDate) : null;

  const handleSelectDate = (value: Dayjs) => {
    const isDateWithinMinMax =
      (minDate
        ? value?.isSame(minDate, "day") || value?.isAfter(minDate, "day")
        : true) &&
      (maxDate
        ? value?.isSame(maxDate, "day") || value?.isBefore(maxDate, "day")
        : true);

    if (!isDateWithinMinMax) {
      return onChange(null);
    }

    if (period && !isDateWithinMinMax) {
      return onChange(null);
    }

    return onChange(value);
  };

  const rows = useMemo((): ICalendarCell[] => getCalenderRow(month), [month]);

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
          const isBeforeMinDate = minDate
            ? value?.isBefore(minDate, "day")
            : false;
          const isAfterMaxDate = maxDate
            ? value?.isAfter(maxDate, "day")
            : false;
          const disabled: boolean = isBeforeMinDate || isAfterMaxDate;

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
