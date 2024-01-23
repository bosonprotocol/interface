import dayjs from "dayjs";
import { CONFIG } from "lib/config";

const MAX_AND_MIN_DATE_TIMESTAMP = 8.64e15; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export const formatDate = (
  timestamp: number,
  {
    textIfTooBig,
    textIfTooSmall,
    format = CONFIG.dateFormat
  }: {
    textIfTooBig: string;
    textIfTooSmall?: string;
    format?: string;
  }
) => {
  if (textIfTooBig && checkIfTimestampIsToo("too_big", timestamp)) {
    return textIfTooBig;
  }
  if (textIfTooSmall && checkIfTimestampIsToo("too_small", timestamp)) {
    return textIfTooSmall;
  }
  return dayjs(timestamp).format(format);
};

export const checkIfTimestampIsToo = (
  checkIf: "too_big" | "too_small",
  timestamp: number
) => {
  return checkIf === "too_big"
    ? timestamp > MAX_AND_MIN_DATE_TIMESTAMP
    : timestamp < MAX_AND_MIN_DATE_TIMESTAMP;
};
