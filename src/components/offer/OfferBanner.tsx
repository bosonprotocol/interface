import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { getDateTimestamp } from "../../lib/utils/getDateTimestamp";

const BannerContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-bottom: 2px solid ${colors.black}20;
  background: ${colors.white};
  font-size: 12px;
  line-height: 11px;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  z-index: ${zIndex.OfferStatus};
`;

interface Props {
  offer: Offer;
  type?: "gone" | "hot" | "soon" | undefined;
}

export default function OfferBanner({ offer }: Props) {
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
          hours: expiry.diff(current, "hours"),
          time: expiry.format("HH:mm")
        }
      }
    };
  };

  const handleText = () => {
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
      return `Only ${offer?.quantityAvailable}/${offer?.quantityInitial} left`;
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
      return expiry.diff.days <= 10
        ? expiry.diff.days <= 0
          ? `Expires ${expiry.diff.isToday ? "today" : "tomorrow"} at ${
              expiry.diff.time
            } UTC${utcValue}`
          : `Expires in ${expiry.diff.days} ${
              expiry.diff.days === 1 ? "day" : "days"
            }`
        : `Expires on ${expiry.date}`;
    }
  };

  return (
    <BannerContainer data-banner data-testid="offer-banner">
      {handleText()}
    </BannerContainer>
  );
}
