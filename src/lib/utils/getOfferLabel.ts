import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

export const isOfferHot = (available: string, initial: string) => {
  const OFFER_HOT_RATIO = 1 / 2;
  return Number(available) / Number(initial) < OFFER_HOT_RATIO;
};
