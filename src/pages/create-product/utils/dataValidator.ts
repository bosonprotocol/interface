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
  offerValidityPeriod: Array<{ $d: string }>;
  redemptionPeriod: Array<{ $d: string }>;
}): ReturnValues => {
  const now = Date.now();
  const numberMinutesAdd = 5;

  let validFromDateInMS = Date.parse(offerValidityPeriod[0].$d);

  if (validFromDateInMS < now) {
    validFromDateInMS = new Date(now + numberMinutesAdd * 60000).getTime();
  }

  let validUntilDateInMS = Date.parse(offerValidityPeriod[1].$d);

  if (validUntilDateInMS < now) {
    validUntilDateInMS = new Date(now + numberMinutesAdd * 2 * 60000).getTime();
  }

  let voucherRedeemableFromDateInMS = Date.parse(redemptionPeriod[0].$d);

  if (voucherRedeemableFromDateInMS < now) {
    voucherRedeemableFromDateInMS = new Date(
      now + numberMinutesAdd * 60000
    ).getTime();
  }

  let voucherRedeemableUntilDateInMS = Date.parse(redemptionPeriod[1].$d);

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
