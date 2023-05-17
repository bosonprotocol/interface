import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isToday from "dayjs/plugin/isToday";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(isToday);

import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import timezones from "../../lib/const/timezones.json";
import { isTruthy } from "../../lib/types/helpers";
import BaseSelect from "../form/BaseSelect";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { ChoosenTime } from "./DatePicker";
import { Selector } from "./DatePicker.style";

interface Props {
  date: Dayjs | null;
  secondDate: Dayjs | null;
  setTime: React.Dispatch<React.SetStateAction<ChoosenTime | null>>;
  period: boolean;
}

const BASE_HOURES = Array.from(Array(24).keys()).map((v) => ({
  label: ("0" + v).slice(-2).toString(),
  value: ("0" + v).slice(-2).toString()
}));
const BASE_MINUTES = Array.from(Array(60).keys()).map((v) => ({
  label: ("0" + v).slice(-2).toString(),
  value: ("0" + v).slice(-2).toString()
}));
const OPTIONS_TIMEZONES = timezones
  .map((timezone) => {
    try {
      return {
        ...timezone,
        label: `${timezone.value} (GMT${dayjs()
          .tz(timezone.value)
          .format("Z")})`
      };
    } catch (error) {
      return false;
    }
  })
  .filter(isTruthy);

export default function SelectTime({
  setTime,
  period,
  date,
  secondDate
}: Props) {
  const DEFAULT_HOUR = useMemo(
    () =>
      period
        ? [date?.isToday() ? dayjs().format("HH") : "00", "23"]
        : date?.isToday()
        ? dayjs().format("HH")
        : "00",
    [period, date]
  );
  const DEFAULT_MINUTE = useMemo(
    () =>
      period
        ? [date?.isToday() ? dayjs().add(5, "minute").format("mm") : "00", "59"]
        : date?.isToday()
        ? dayjs().add(5, "minute").format("mm")
        : "00",
    [period, date]
  );
  const DEFAULT_TIME = useMemo(() => (period ? ["00", "00"] : "00"), [period]);
  const [timezone, setTimezone] = useState<string>(dayjs.tz.guess());
  const [hour, setHour] = useState<string | string[]>(
    DEFAULT_HOUR || DEFAULT_TIME
  );
  const [minute, setMinute] = useState<string | string[]>(
    DEFAULT_MINUTE || DEFAULT_TIME
  );

  useEffect(() => {
    setTime({
      hour,
      minute,
      timezone
    });
  }, [setTime, hour, minute, timezone]);

  const handleHourSet = useCallback(
    (value: string, first: boolean) => {
      if (period) {
        if (first) {
          setHour([value, hour[1] ?? ""]);
        } else {
          setHour([hour[0] ?? "", value]);
        }
      } else {
        setHour(value);
      }
    },
    [hour, setHour, period]
  );

  const handleMinuteSet = useCallback(
    (value: string, first: boolean) => {
      if (period) {
        if (first) {
          setMinute([value, minute[1] ?? ""]);
        } else {
          setMinute([minute[0] ?? "", value]);
        }
      } else {
        setMinute(value);
      }
    },
    [minute, setMinute, period]
  );

  return (
    <div>
      <Selector style={{ justifyContent: "center" }}>Select Time</Selector>
      <Grid gap="0.5rem" flexDirection="column" margin="1rem 0 0 0">
        <BaseSelect
          options={OPTIONS_TIMEZONES}
          onChange={(o) => setTimezone(o?.value ?? "")}
          defaultValue={
            OPTIONS_TIMEZONES.filter((v) => v.value === timezone)[0] || null
          }
        />
        {period && (
          <Typography tag="p" margin="0">
            Select time for {date?.format("MMMM D, YYYY")}
          </Typography>
        )}
        <Grid justifyContent="space-around" gap="0.5rem">
          <BaseSelect
            options={BASE_HOURES}
            onChange={(o) => handleHourSet(o?.value ?? "00", true)}
            defaultValue={
              BASE_HOURES.filter(
                (v) => v.value === hour || v.value === hour[0]
              )[0] || null
            }
          />
          :
          <BaseSelect
            options={BASE_MINUTES}
            onChange={(o) => handleMinuteSet(o?.value ?? "00", true)}
            defaultValue={
              BASE_MINUTES.filter(
                (v) => v.value === minute || v.value === minute[0]
              )[0] || null
            }
          />
        </Grid>
        {period && (
          <>
            <Typography tag="p" margin="0">
              Select time for {secondDate?.format("MMMM D, YYYY")}
            </Typography>
            <Grid justifyContent="space-around" gap="0.5rem">
              <BaseSelect
                options={BASE_HOURES}
                onChange={(o) => handleHourSet(o?.value ?? "00", false)}
                defaultValue={
                  BASE_HOURES.filter(
                    (v) => v.value === hour || v.value === hour[1]
                  )[0] || null
                }
              />
              :
              <BaseSelect
                options={BASE_MINUTES}
                onChange={(o) => handleMinuteSet(o?.value ?? "00", false)}
                defaultValue={
                  BASE_MINUTES.filter(
                    (v) => v.value === minute || v.value === minute[1]
                  )[0] || null
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}
