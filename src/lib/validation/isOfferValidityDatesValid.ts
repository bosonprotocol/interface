import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isTruthy } from "lib/types/helpers";

function isOfferValidityDatesValid() {
  return this.test(
    "isOfferValidityDatesValid",
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
            "Offer validity period has to have a beggining date and an end date"
        });
      }
      const rpValue: (Dayjs | null)[] = this.parent.redemptionPeriod;
      if (!rpValue && !this.parent.infiniteExpirationOffers) {
        throw this.createError({
          path: this.path,
          message: "Set the redemption period too"
        });
      }
      const doesItEndBefore =
        rpValue[1] instanceof dayjs
          ? rpValue[1]?.isBefore(value[1])
          : dayjs(rpValue[1])?.isBefore(value[1]);

      if (rpValue && doesItEndBefore) {
        const coreTermsKey: "variantsCoreTermsOfSale" | "coreTermsOfSale" =
          this.path.split(".")[0];
        throw this.createError({
          path: `${coreTermsKey}.redemptionPeriod`,
          message:
            "Redemption period has to end after or be equal to validity period"
        });
      }
      return true;
    }
  );
}
export default isOfferValidityDatesValid;
