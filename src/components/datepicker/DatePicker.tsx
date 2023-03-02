/* eslint @typescript-eslint/no-explicit-any: "off" */
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import { useCallback, useEffect, useRef, useState } from "react";

import { FieldInput } from "../form/Field.styles";
import Calendar from "./Calendar";
import { DatePickerWrapper, Picker, PickerGrid } from "./DatePicker.style";
import SelectMonth from "./SelectMonth";
import SelectTime from "./SelectTime";

interface Props {
  initialValue?: Dayjs | Array<Dayjs> | null;
  onChange?: (selected: Dayjs | Array<Dayjs | null>) => void;
  error?: string;
  period: boolean;
  selectTime: boolean;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  [x: string]: any;
}
export interface ChoosenTime {
  hour: string | Array<string>;
  minute: string | Array<string>;
  timezone: string;
}

const handleInitialDates = (
  initialValue: Dayjs | Array<Dayjs> | null | undefined
) => {
  let startDate: Dayjs | null = null;
  let endDate: Dayjs | null = null;

  if (Array.isArray(initialValue)) {
    startDate = dayjs(initialValue[0]);
    endDate = dayjs(initialValue[1]);
  } else {
    startDate = dayjs(initialValue);
  }

  return {
    startDate,
    endDate
  };
};
const dateTimeFormat = "LLL";
export default function DatePicker({
  initialValue,
  onChange,
  period,
  selectTime,
  maxDate,
  minDate = dayjs(),
  ...props
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [time, setTime] = useState<ChoosenTime | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [secondDate, setSecondDate] = useState<Dayjs | null>(null);
  const [shownDate, setShownDate] = useState<string>("Choose dates...");
  const [show, setShow] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);

  useEffect(() => {
    const { startDate, endDate } = handleInitialDates(initialValue);
    if (date === null) setDate(startDate);
    if (secondDate === null) setSecondDate(endDate);
  }, [initialValue]); // eslint-disable-line

  const handleShow = () => {
    setShow(!show);
  };

  const reset = useCallback(() => {
    setDate(null);
    setSecondDate(null);
    setShowTime(false);
    setShownDate("Choose dates...");
  }, []);

  const handleDateChange = (inputDate: Dayjs | null) => {
    if (inputDate === null) {
      return reset();
    }

    if (period) {
      if (date === null || (date !== null && secondDate !== null)) {
        setDate(inputDate);
        setSecondDate(null);
      } else if (secondDate === null) {
        setSecondDate(inputDate);
      }
    } else {
      setDate(inputDate);
    }
  };

  useEffect(() => {
    if (
      (!period && date !== null) ||
      (period && date !== null && secondDate !== null)
    ) {
      setShowTime(true);
    }

    if (
      (!period && date === null) ||
      (period && date === null && secondDate === null)
    ) {
      setShownDate("Choose dates...");
    }
  }, [date, secondDate, period]);

  useEffect(() => {
    if (period) {
      if (date instanceof dayjs && secondDate instanceof dayjs) {
        let newDate = date;
        let newSecondDate = secondDate;

        if (time !== null) {
          newDate = date
            .tz(time.timezone)
            .set("hour", Number(time.hour[0]))
            .set("minute", Number(time.minute[0]));
          newSecondDate = secondDate
            .tz(time.timezone)
            .set("hour", Number(time.hour[1]))
            .set("minute", Number(time.minute[1]));
        }
        setShownDate(
          `${newDate?.format(dateTimeFormat)} - ${newSecondDate?.format(
            dateTimeFormat
          )}`
        );
        onChange?.([newDate, newSecondDate]);
      }
    } else {
      if (date instanceof dayjs) {
        let newDate = date;
        if (time !== null) {
          newDate = date
            .tz(time.timezone)
            .set("hour", Number(time.hour))
            .set("minute", Number(time.minute));
        }
        setShownDate(newDate?.format(dateTimeFormat));
        onChange?.(newDate);
      }
    }
  }, [date, secondDate, time]); // eslint-disable-line

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
      <FieldInput value={shownDate} onClick={handleShow} {...props} readOnly />
      <DatePickerWrapper
        show={show}
        selectTime={selectTime && showTime}
        ref={(r) => {
          ref.current = r;
        }}
      >
        <PickerGrid selectTime={selectTime && showTime}>
          <div>
            <SelectMonth month={month} setMonth={setMonth} />
            <Calendar
              date={date}
              secondDate={secondDate}
              month={month}
              period={period}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
          {selectTime && showTime && (
            <SelectTime
              date={date}
              secondDate={secondDate}
              setTime={setTime}
              period={period}
            />
          )}
        </PickerGrid>
      </DatePickerWrapper>
    </Picker>
  );
}
