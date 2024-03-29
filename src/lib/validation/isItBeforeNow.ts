import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

function isItBeforeNow() {
  return this.test("isItBeforeNow", function (value: (Dayjs | null)[]) {
    if (!value) {
      return false;
    }
    const startBeforeNow =
      value[0] instanceof dayjs
        ? value[0]?.isBefore(dayjs())
        : dayjs(value[0])?.isBefore(dayjs());

    if (startBeforeNow) {
      throw this.createError({
        path: this.path,
        message: "Selected date can't be in the past"
      });
    }
    return true;
  });
}
export default isItBeforeNow;
