import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

function isOfferValidityDatesValid(path = "") {
  return this.test(
    "isOfferValidityDatesValid",
    function (value: (Dayjs | null)[]) {
      const rpValue: (Dayjs | null)[] = this.parent.redemptionPeriod;
      const doesItEndBefore =
        rpValue[1] instanceof dayjs
          ? rpValue[1]?.isBefore(value[1])
          : dayjs(rpValue[1])?.isBefore(value[1]);

      if (doesItEndBefore) {
        throw this.createError({
          path: path || "coreTermsOfSale.redemptionPeriod",
          message:
            "Redemption period has to be after or equal to validity period"
        });
      }
      return true;
    }
  );
}
export default isOfferValidityDatesValid;
