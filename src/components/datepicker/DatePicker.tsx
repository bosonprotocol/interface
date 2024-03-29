/* eslint @typescript-eslint/no-explicit-any: "off" */
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

import { getTimeZoneWithGMT } from "lib/utils/time";
import {
  FocusEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { useDidMountEffect } from "../../lib/utils/hooks/useDidMountEffect";
import { FieldInput } from "../form/Field.styles";
import Calendar from "./Calendar";
import {
  ClearButton,
  DatePickerWrapper,
  Picker,
  PickerGrid
} from "./DatePicker.style";
import SelectMonth from "./SelectMonth";
import SelectTime from "./SelectTime";

export type DatePickerProps = {
  initialValue?: Dayjs | Array<Dayjs> | null;
  onChange?: (selected: Dayjs | Array<Dayjs | null> | null | undefined) => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  onClick?: () => void;
  error?: string;
  period: boolean;
  selectTime: boolean;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  isClearable?: boolean;
  placeholder?: string;
  name?: string;
  [x: string]: any;
};
export type ChoosenTime = {
  hour: string | Array<string>;
  minute: string | Array<string>;
  timezone: string;
};

const handleInitialDates = (
  initialValue: Dayjs | Array<Dayjs> | null | undefined
) => {
  let startDate: Dayjs | null = null;
  let endDate: Dayjs | null = null;
  let chosenTime: ChoosenTime | null = null;

  if (initialValue) {
    if (Array.isArray(initialValue)) {
      if (initialValue.length) {
        startDate = dayjs(initialValue[0]);
        endDate = dayjs(initialValue[1]);
        chosenTime = {
          hour: [
            startDate.toDate().getHours().toString(),
            endDate.toDate().getHours().toString()
          ],
          minute: [
            startDate.toDate().getMinutes().toString(),
            endDate.toDate().getMinutes().toString()
          ],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          timezone: startDate.$x.$timezone ?? endDate.$x.$timezone
        };
      }
    } else {
      startDate = dayjs(initialValue);
      chosenTime = {
        hour: startDate.toDate().getHours().toString(),
        minute: startDate.toDate().getMinutes().toString(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        timezone: startDate.$x.$timezone
      };
    }
  }

  return {
    startDate,
    endDate,
    chosenTime
  };
};
const dateTimeFormat = "MMMM D, YYYY HH:mm";
export default memo(function DatePicker({
  initialValue,
  onChange,
  onBlur,
  onClick,
  period,
  selectTime,
  maxDate,
  minDate = dayjs(),
  isClearable,
  placeholder = "Choose dates...",
  ...props
}: DatePickerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [time, setTime] = useState<ChoosenTime | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [secondDate, setSecondDate] = useState<Dayjs | null>(null);
  const [shownDate, setShownDate] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);

  useEffect(() => {
    const { startDate, endDate, chosenTime } = handleInitialDates(initialValue);
    if (date === null) setDate(startDate);
    if (secondDate === null) setSecondDate(endDate);
    if (chosenTime === null) setTime(chosenTime);
  }, [initialValue]); // eslint-disable-line

  const handleShow = () => {
    setShow(!show);
    onClick?.();
  };

  const reset = useCallback(() => {
    setDate(null);
    setSecondDate(null);
    setShowTime(false);
    setShownDate("");
  }, []);

  const handleDateChange = (inputDate: Dayjs | null) => {
    if (inputDate === null) {
      return reset();
    }

    if (period) {
      if (date === null || (date !== null && secondDate !== null)) {
        setDate(inputDate);
        setSecondDate(null);
      } else if (
        date !== null &&
        secondDate === null &&
        inputDate?.isBefore(date, "day")
      ) {
        setDate(inputDate);
        setSecondDate(date);
      } else if (secondDate === null) {
        setSecondDate(inputDate);
      }
    } else {
      setDate(inputDate);
    }
  };

  useDidMountEffect(() => {
    if ((!period && date !== null) || (period && date !== null)) {
      setShowTime(true);
    }

    if (
      (!period && date === null) ||
      (period && date === null && secondDate === null)
    ) {
      setShownDate("");
      if (period) {
        onChange?.([]);
      } else {
        onChange?.(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, secondDate, period]);

  useEffect(() => {
    if (period) {
      if (date instanceof dayjs && secondDate instanceof dayjs) {
        let newDate = date;
        let newSecondDate = secondDate;

        if (time !== null) {
          const prevDay = date.get("day");
          newDate = date
            .tz(time.timezone)
            .set("day", prevDay)
            .set("hour", Number(time.hour[0]))
            .set("minute", Number(time.minute[0]));
          const prevSecondDay = secondDate.get("day");
          newSecondDate = secondDate
            .tz(time.timezone)
            .set("day", prevSecondDay)
            .set("hour", Number(time.hour[1]))
            .set("minute", Number(time.minute[1]));
        }
        setShownDate(
          `${newDate?.format(dateTimeFormat)} - ${newSecondDate?.format(
            dateTimeFormat
          )} ${
            time && newDate.isValid()
              ? `(${getTimeZoneWithGMT(time.timezone)})`
              : ""
          }`
        );
        onChange?.([newDate, newSecondDate]);
      }
    } else {
      if (date instanceof dayjs) {
        let newDate = date;
        if (time !== null) {
          const prevDay = date.get("day");
          newDate = date
            .tz(time.timezone)
            .set("day", prevDay)
            .set("hour", Number(time.hour))
            .set("minute", Number(time.minute));
        }
        setShownDate(
          `${newDate?.format(dateTimeFormat)} ${
            time && newDate.isValid()
              ? `(${getTimeZoneWithGMT(time.timezone)})`
              : ""
          }`
        );
        onChange?.(newDate);
      }
    }
  }, [date, secondDate, time]); // eslint-disable-line
  useEffect(() => {
    if (!period) {
      setSecondDate(null);
    }
  }, [period]);
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
      <FieldInput
        value={shownDate}
        onClick={handleShow}
        onBlur={onBlur}
        {...props}
        readOnly
        placeholder={placeholder}
      />
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
      {isClearable && <ClearButton onClick={reset} />}
    </Picker>
  );
});
