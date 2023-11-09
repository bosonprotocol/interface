import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isTruthy } from "lib/types/helpers";

function isRedemptionDatesValid() {
  return this.test(
    "isRedemptionDatesValid",
    function (value: (Dayjs | null)[]) {
      if (!value) {
        return false;
      }
      if (
        !this.parent.infiniteExpirationOffers &&
        Array.isArray(value) &&
        value.filter(isTruthy).length !== 2
      ) {
        throw this.createError({
          path: this.path,
          message:
            "Redemption period has to have a beginning date and an end date"
        });
      }
      const ovValue = this.parent.offerValidityPeriod;
      if (!ovValue || (ovValue && ovValue.length !== 2)) {
        throw this.createError({
          path: this.path,
          message: "Please define an offer validity period"
        });
      }
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
