import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");
import { useMemo } from "react";

import { CONFIG } from "../../config";
import { Offer } from "../../types/offer";
import { getDateTimestamp } from "../getDateTimestamp";

export function useHandleText(offer: Offer) {
  const handleDate = (offer: Offer) => {
    const current = dayjs();
    const release = dayjs(getDateTimestamp(offer?.validFromDate));
    const expiry = dayjs(getDateTimestamp(offer?.validUntilDate));

    return {
      current,
      release: {
        date: release.format(CONFIG.dateFormat),
        diff: {
          days: release.diff(current, "days"),
          isToday: release.isSame(current, "day"),
          isReleased: release.isBefore(current),
          hours: release.diff(current, "hours"),
          time: release.format("HH:mm")
        }
      },
      expiry: {
        date: expiry.format(CONFIG.dateFormat),
        diff: {
          days: expiry.diff(current, "days"),
          isToday: expiry.isSame(current, "day"),
          isExpired: expiry.isBefore(current),
          hours: expiry.diff(current, "hours"),
          time: expiry.format("HH:mm")
        }
      }
    };
  };
  const handleText = useMemo(() => {
    const { release, expiry } = handleDate(offer);
    const aspectRatio = 1 / 2;
    const optionQuantity =
      Number(offer?.quantityAvailable) / Number(offer?.quantityInitial) <
      aspectRatio;
    const optionRelease =
      !release.diff.isReleased &&
      release.diff.days >= 0 &&
      expiry.diff.days !== 0;
    const utcOffset = -(new Date().getTimezoneOffset() / 60);
    const utcValue =
      utcOffset === 0 ? "" : utcOffset < 0 ? `-${utcOffset}` : `+${utcOffset}`;

    if (optionQuantity) {
      return offer?.quantityAvailable === "0"
        ? "Sold out"
        : `Only ${offer?.quantityAvailable}/${offer?.quantityInitial} left`;
    } else if (optionRelease) {
      return release.diff.days <= 10
        ? release.diff.days <= 0
          ? `Releases ${release.diff.isToday ? "today" : "tomorrow"} at ${
              release.diff.time
            } UTC${utcValue}`
          : `Releases in ${release.diff.days} ${
              release.diff.days === 1 ? "day" : "days"
            }`
        : `Releases on ${release.date}`;
    } else {
      return expiry.diff.isExpired
        ? `Expired`
        : expiry.diff.days <= 10
        ? expiry.diff.days <= 0
          ? `Expires ${expiry.diff.isToday ? "today" : "tomorrow"} at ${
              expiry.diff.time
            } UTC${utcValue}`
          : `Expires in ${expiry.diff.days} ${
              expiry.diff.days === 1 ? "day" : "days"
            }`
        : `Expires on ${expiry.date}`;
    }
  }, [offer]);

  return handleText;
}
