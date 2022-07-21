import type { Dayjs } from "dayjs";

export interface ICalendarCell {
  text: string;
  value: Dayjs;
  current: boolean;
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

export function getCells(date: Dayjs): ICalendarCell[] {
  const daysInMonth = date.daysInMonth();
  const cells: ICalendarCell[] = [];

  const createCell = (date: Dayjs, dayNumber: number, current: boolean) => {
    return {
      text: String(dayNumber),
      value: date.clone().set("date", dayNumber),
      current
    };
  };

  for (let i = 0; i < daysInMonth; i++) {
    cells.push(createCell(date, i + 1, true));
  }

  const cellsToAdd = 35 - daysInMonth;
  const lastMonth = date.subtract(1, "month");
  for (let i = 0; i < Math.floor(cellsToAdd / 2); i++) {
    cells.unshift(createCell(lastMonth, lastMonth.daysInMonth() - i, false));
  }

  const nextMonth = date.add(1, "month");
  for (let i = 0; i < Math.round(cellsToAdd / 2); i++) {
    cells.push(createCell(nextMonth, i + 1, false));
  }

  return cells;
}

export function getRows(date: Dayjs): Array<ICalendarCell[]> {
  const cells = getCells(date);
  const rows: Array<ICalendarCell[]> = [];

  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
}
