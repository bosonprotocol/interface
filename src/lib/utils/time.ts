import dayjs from "dayjs";
import importedTimezones from "lib/constants/timezones.json";
import { isTruthy } from "lib/types/helpers";

export const timezones = importedTimezones
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

export const getTimeZoneWithGMT = (timezoneValue: string) => {
  const tzObj = timezones.find((tz) => tz.value === timezoneValue);
  return tzObj?.label ?? timezoneValue;
};
