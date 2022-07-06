import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

import { Offer } from "../types/offer";
import { colors } from "./../styles/colors";

export const OFFER_LABEL_TYPES = {
  HOT: {
    name: "HOT",
    emoji: "🔥",
    color: colors.darkGrey,
    background: colors.lightGrey
  },
  COOMING_SOON: {
    name: "COOMING_SOON",
    emoji: "⏱️",
    color: colors.darkGrey,
    background: colors.lightGrey
  },
  EXPIRING_SOON: {
    name: "EXPIRING_SOON",
    emoji: "⏱️",
    color: colors.darkGrey,
    background: colors.lightGrey
  }
};

export const getOfferLabel = (offer: Offer) => {
  const current = dayjs();
  const release = dayjs(Number(offer?.validFromDate) * 1000);
  const expiry = dayjs(Number(offer?.validUntilDate) * 1000);

  const aspectRatio = 1 / 2;
  const optionQuantity =
    Number(offer?.quantityAvailable) / Number(offer?.quantityInitial) <
    aspectRatio;
  const optionRelease =
    release.diff(current, "days") >= 0 && expiry.diff(current, "days") !== 0;

  if (optionQuantity) {
    return OFFER_LABEL_TYPES.HOT.name;
  } else if (optionRelease) {
    return OFFER_LABEL_TYPES.COOMING_SOON.name;
  } else {
    return OFFER_LABEL_TYPES.EXPIRING_SOON.name;
  }
};
