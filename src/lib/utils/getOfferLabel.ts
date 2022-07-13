import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

import { Offer } from "../types/offer";
import { colors } from "./../styles/colors";
import { getDateTimestamp } from "./getDateTimestamp";

export const OFFER_LABEL_TYPES = {
  HOT: {
    display: true,
    name: "HOT",
    emoji: "🔥",
    color: colors.darkGrey,
    background: colors.lightGrey
  },
  COMING_SOON: {
    display: true,
    name: "COMING_SOON",
    emoji: "⏱️",
    color: colors.darkGrey,
    background: colors.lightGrey
  },
  EXPIRING_SOON: {
    display: true,
    name: "EXPIRING_SOON",
    emoji: "⏱️",
    color: colors.darkGrey,
    background: colors.lightGrey
  },
  EXPIRED: {
    display: true,
    name: "EXPIRED",
    emoji: "✖️",
    color: colors.white,
    background: colors.red
  },
  NORMAL: {
    display: false,
    name: "NORMAL",
    emoji: "",
    color: colors.white,
    background: colors.black
  }
};

export const isOfferHot = (available: string, initial: string) => {
  const ASPECT_RATIO = 1 / 2;
  return Number(available) / Number(initial) < ASPECT_RATIO;
};

export const getOfferLabel = (offer: Offer) => {
  const current = dayjs();
  const release = dayjs(getDateTimestamp(offer?.validFromDate));
  const expiry = dayjs(getDateTimestamp(offer?.validUntilDate));

  const optionQuantity = isOfferHot(
    offer?.quantityAvailable,
    offer?.quantityInitial
  );
  const optionRelease = release.isAfter(current);
  const optionExpiring =
    expiry.isAfter(current) && expiry.diff(current, "hours") <= 24;
  const expired = expiry.isBefore(current);

  if (optionQuantity) {
    return OFFER_LABEL_TYPES.HOT.name;
  } else if (optionRelease) {
    return OFFER_LABEL_TYPES.COMING_SOON.name;
  } else if (optionExpiring) {
    return OFFER_LABEL_TYPES.EXPIRING_SOON.name;
  } else if (expired) {
    return OFFER_LABEL_TYPES.EXPIRED.name;
  }

  return false;
};
