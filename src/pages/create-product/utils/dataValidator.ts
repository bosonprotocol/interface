import type { Dayjs } from "dayjs";

interface ReturnValues {
  validFromDateInMS: number;
  validUntilDateInMS: number;
  voucherRedeemableFromDateInMS: number;
  voucherRedeemableUntilDateInMS: number;
  voucherValidDurationInMS: number;
}
export const extractOfferTimestamps = ({
  offerValidityPeriod,
  redemptionPeriod,
  infiniteExpirationOffers,
  voucherValidDurationInDays
}: {
  offerValidityPeriod: Array<Dayjs> | Dayjs;
  redemptionPeriod: Array<Dayjs> | Dayjs | undefined;
  infiniteExpirationOffers: boolean;
  voucherValidDurationInDays: number | undefined;
}): ReturnValues => {
  const now = Date.now();
  const numberMinutesAdd = 5;

  if (
    infiniteExpirationOffers &&
    (Array.isArray(offerValidityPeriod) || Array.isArray(redemptionPeriod))
  ) {
    throw new Error(
      `Either offerValidityPeriod(${offerValidityPeriod}) or redemptionPeriod(${redemptionPeriod}) are arrays and infinite offers are enabled`
    );
  }

  const validFromDateInMS = Array.isArray(offerValidityPeriod)
    ? offerValidityPeriod[0].toDate().getTime()
    : offerValidityPeriod.toDate().getTime();

  let validUntilDateInMS = Array.isArray(offerValidityPeriod)
    ? offerValidityPeriod[1].toDate().getTime()
    : Number.MAX_SAFE_INTEGER; // infinite offers
  if (validUntilDateInMS < now) {
    validUntilDateInMS = new Date(now + numberMinutesAdd * 2 * 60000).getTime();
  }

  let voucherRedeemableFromDateInMS = Array.isArray(redemptionPeriod)
    ? redemptionPeriod[0].toDate().getTime()
    : redemptionPeriod
    ? redemptionPeriod.toDate().getTime()
    : undefined;
  if (voucherRedeemableFromDateInMS === undefined) {
    voucherRedeemableFromDateInMS = 0;
  } else if (voucherRedeemableFromDateInMS < now) {
    voucherRedeemableFromDateInMS = new Date(
      now + numberMinutesAdd * 60000
    ).getTime();
  }

  let voucherRedeemableUntilDateInMS = Array.isArray(redemptionPeriod)
    ? redemptionPeriod[1].toDate().getTime()
    : undefined;
  let voucherValidDurationInMS = 0;
  if (
    voucherRedeemableUntilDateInMS !== undefined &&
    voucherRedeemableUntilDateInMS <= now
  ) {
    voucherRedeemableUntilDateInMS = new Date(
      now + numberMinutesAdd * 2 * 60000
    ).getTime();
    voucherValidDurationInMS = 0;
  } else if (voucherRedeemableUntilDateInMS === undefined) {
    voucherValidDurationInMS = (voucherValidDurationInDays ?? 0) * 86400000;
    voucherRedeemableUntilDateInMS = 0;
  }

  return {
    validFromDateInMS,
    validUntilDateInMS,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS,
    voucherValidDurationInMS
  };
};
