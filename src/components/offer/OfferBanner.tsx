import moment from "moment";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";

const BannerContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border: 1px solid ${colors.black}20;
  border-bottom-width: 2px;

  background: ${colors.white};
  padding: 0.5rem;
`;

interface Props {
  offer: Offer;
  type?: "featured" | "hot" | "soon" | undefined;
}

export default function OfferBanner({ offer, type }: Props) {
  const handleDate = (offer: Offer) => {
    const current = moment();
    const release = moment(Number(offer?.validFromDate) * 1000);
    const expiry = moment(Number(offer?.validUntilDate) * 1000);

    return {
      current,
      release: {
        date: release.format("DD/MM/YYYY"),
        diff: {
          days: release.diff(current, "days"),
          hours: release.diff(current, "hours"),
          left: moment.utc(release.diff(current)).format("mm:ss")
        }
      },
      expiry: {
        date: expiry.format("DD/MM/YYYY"),
        diff: {
          days: expiry.diff(current, "days"),
          hours: expiry.diff(current, "hours"),
          left: moment.utc(expiry.diff(current)).format("mm:ss")
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
    const optionRelease = release.diff.days >= 0 && expiry.diff.days !== 0;

    if (optionQuantity) {
      return `Only ${offer?.quantityAvailable}/${offer?.quantityInitial} left`;
    } else if (optionRelease) {
      return release.diff.days <= 10
        ? release.diff.days <= 0
          ? release.diff.hours <= 0
            ? `Release today in ${release.diff.left}`
            : `Release today in ${release.diff.hours}h`
          : `Release in ${release.diff.days} ${
              release.diff.days === 1 ? "day" : "days"
            }`
        : `Release on ${release.date}`;
    } else {
      return expiry.diff.days <= 10
        ? expiry.diff.days <= 0
          ? expiry.diff.hours <= 0
            ? `Expires today in ${expiry.diff.left}`
            : `Expires today in ${expiry.diff.hours}h`
          : `Expires in ${expiry.diff.days} ${
              expiry.diff.days === 1 ? "day" : "days"
            }`
        : `Expires on ${expiry.date}`;
    }
  };

  return <BannerContainer data-banner>{handleText()}</BannerContainer>;
}
