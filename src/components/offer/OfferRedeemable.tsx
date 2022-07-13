import { Offer } from "../../lib/types/offer";

interface Props {
  offer: Offer;
}
const oneSecondToDays = 86400;
const getDayOrDays = (value: number) => (value === 1 ? "day" : "days");

export default function OfferRedeemable({ offer }: Props) {
  const redeemableDays = Math.round(
    Number(offer.voucherValidDuration) / oneSecondToDays
  );
  return (
    <>
      Redeemable until {redeemableDays} {getDayOrDays(redeemableDays)} after
      commit
    </>
  );
  // const redeemableFrom = dayjs(Number(offer.validFromDate) * 1000).format(
  //   CONFIG.dateFormat
  // );
  // const redeemableUntil = dayjs(
  //   Number(offer.validFromDate) * 1000 +
  //     Number(offer.voucherValidDuration) * 1000
  // ).format(CONFIG.dateFormat);
  // return (
  //   <>
  //     Redeemable from {redeemableFrom} until {redeemableUntil}
  //   </>
  // );
}
