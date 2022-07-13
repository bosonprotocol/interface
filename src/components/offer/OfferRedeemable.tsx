import dayjs from "dayjs";

import { CONFIG } from "../../lib/config";
import { Offer } from "../../lib/types/offer";

interface Props {
  offer: Offer;
}

export default function OfferRedeemable({ offer }: Props) {
  const redeemableFrom = dayjs(Number(offer.validFromDate) * 1000).format(
    CONFIG.dateFormat
  );
  const redeemableUntil = dayjs(
    Number(offer.validFromDate) * 1000 +
      Number(offer.voucherValidDuration) * 1000
  ).format(CONFIG.dateFormat);
  return (
    <>
      Redeemable from {redeemableFrom} until {redeemableUntil}
    </>
  );
}
