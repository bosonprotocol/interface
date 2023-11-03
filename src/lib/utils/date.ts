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
    textIfTooBig?: string;
    textIfTooSmall?: string;
    format?: string;
  } = {}
) => {
  if (textIfTooBig && timestamp > MAX_AND_MIN_DATE_TIMESTAMP) {
    return textIfTooBig;
  }
  if (textIfTooSmall && timestamp < MAX_AND_MIN_DATE_TIMESTAMP) {
    return textIfTooSmall;
  }
  return dayjs(timestamp).format(format);
};
