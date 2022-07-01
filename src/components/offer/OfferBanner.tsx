import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";

const BannerContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-bottom: 2px solid ${colors.black}20;

  background: ${colors.white};
  padding: 0.5rem;

  font-size: 12px;
  font-weight: 600;
  padding: 0.4rem 1.5rem;
`;

interface Props {
  offer: Offer;
  type?: "featured" | "hot" | "soon" | undefined;
}

export default function OfferBanner({ offer }: Props) {
  const handleDate = (offer: Offer) => {
    const current = dayjs();
    const release = dayjs(Number(offer?.validFromDate) * 1000);
    const expiry = dayjs(Number(offer?.validUntilDate) * 1000);

    return {
      current,
      release: {
        date: release.format("DD/MM/YYYY"),
        diff: {
          days: release.diff(current, "days"),
          isToday: release.isSame(current, "day"),
          hours: release.diff(current, "hours"),
          time: release.format("HH:mm")
        }
      },
      expiry: {
        date: expiry.format("DD/MM/YYYY"),
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
    const optionQuantity =
      Number(offer?.quantityAvailable) < Number(offer?.quantityInitial) &&
      Number(offer?.quantityAvailable) <= 10;
    const optionRelease = release.diff.days >= 0 && expiry.diff.days !== 0;
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
