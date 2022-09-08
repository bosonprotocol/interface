import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

function isItBeforeNow() {
  return this.test("isItBeforeNow", function (value: (Dayjs | null)[]) {
    const startBeforeNow = value[0]?.isBefore(dayjs());
    console.log(this.path, startBeforeNow, value);

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
