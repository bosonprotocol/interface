import type { Dayjs } from "dayjs";

import { CONFIG } from "../../lib/config";

export interface ICalendarCell {
  text: string;
  value: Dayjs;
  current: boolean;
  day: string;
  date: string;
}

export function changeMonth(date: Dayjs, isNext: boolean): Dayjs {
  if (date.month() === 0 && !isNext) {
    return date.set("year", date.year() - 1).set("month", 11);
  }
  if (date.month() === 11 && isNext) {
    return date.set("year", date.year() + 1).set("month", 0);
  }
  return date.add(isNext ? 1 : -1, "month");
}

export function getCells(selectedDate: Dayjs, date: Dayjs): ICalendarCell[] {
  const daysInMonth = date.daysInMonth();
  const cells: ICalendarCell[] = [];

  const createCell = (date: Dayjs, dayNumber: number, current: boolean) => {
    const newDate = date.clone().set("date", dayNumber);
    return {
      text: String(dayNumber),
      value: newDate,
      day: newDate.format("d"),
      date: newDate.format(CONFIG.dateFormat),
      current
    };
  };

  for (let i = 0; i < daysInMonth; i++) {
    cells.push(createCell(date, i + 1, true));
  }

  const firstMonday = cells.findIndex(({ day }: ICalendarCell) => day === "1");
  const daysBeforeMondayToAdd = firstMonday > 0 ? 7 - firstMonday : 0;
  const lastMonth = date.subtract(1, "month");
  for (let i = 0; i < daysBeforeMondayToAdd; i++) {
    cells.unshift(createCell(lastMonth, lastMonth.daysInMonth() - i, false));
  }

  const lastDay = Number(cells[cells.length - 1].day);
  const daysAfterEndOfTheMonthToAdd = lastDay === 0 ? 0 : 7 - Number(lastDay);
  const nextMonth = date.add(1, "month");
  for (let i = 0; i < daysAfterEndOfTheMonthToAdd; i++) {
    cells.push(createCell(nextMonth, i + 1, false));
  }
  return cells;
}

export function getRows(date: Dayjs): Array<ICalendarCell[]> {
  const cells = getCells(date, date.startOf("month"));
  const rows: Array<ICalendarCell[]> = [];

  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
}
