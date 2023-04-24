import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

function isRedemptionDatesValid() {
  return this.test(
    "isRedemptionDatesValid",
    function (value: (Dayjs | null)[]) {
      if (!value) {
        return false;
      }
      const ovValue = this.parent.offerValidityPeriod;
      const doesItEndBefore =
        value[1] instanceof dayjs
          ? value[1]?.isBefore(ovValue[1])
          : dayjs(value[1])?.isBefore(ovValue[1]);

      if (ovValue && doesItEndBefore) {
        throw this.createError({
          path: this.path,
          message:
            "Redemption period has to end after or be equal to validity period"
        });
      }
      return true;
    }
  );
}
export default isRedemptionDatesValid;
