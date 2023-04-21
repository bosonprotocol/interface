import type { Dayjs } from "dayjs";

interface ReturnValues {
  validFromDateInMS: number;
  validUntilDateInMS: number;
  voucherRedeemableFromDateInMS: number;
  voucherRedeemableUntilDateInMS: number;
}
export const validateDates = ({
  offerValidityPeriod,
  redemptionPeriod
}: {
  offerValidityPeriod: Array<Dayjs>;
  redemptionPeriod: Array<Dayjs>;
}): ReturnValues => {
  const now = Date.now();
  const numberMinutesAdd = 5;

  let validFromDateInMS = offerValidityPeriod[0].toDate().getTime();
  if (validFromDateInMS < now) {
    validFromDateInMS = new Date(now + numberMinutesAdd * 60000).getTime();
  }

  let validUntilDateInMS = offerValidityPeriod[1].toDate().getTime();
  if (validUntilDateInMS < now) {
    validUntilDateInMS = new Date(now + numberMinutesAdd * 2 * 60000).getTime();
  }

  let voucherRedeemableFromDateInMS = redemptionPeriod[0].toDate().getTime();
  if (voucherRedeemableFromDateInMS < now) {
    voucherRedeemableFromDateInMS = new Date(
      now + numberMinutesAdd * 60000
    ).getTime();
  }

  let voucherRedeemableUntilDateInMS = redemptionPeriod[1].toDate().getTime();
  if (voucherRedeemableUntilDateInMS < now) {
    voucherRedeemableUntilDateInMS = new Date(
      now + numberMinutesAdd * 2 * 60000
    ).getTime();
  }

  return {
    validFromDateInMS,
    validUntilDateInMS,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS
  };
};
