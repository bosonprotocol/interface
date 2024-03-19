import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { NO_EXPIRATION } from "lib/constants/offer";
import { formatDate } from "lib/utils/date";
import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import { ArrowRight } from "phosphor-react";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Profile } from "../../../lib/utils/hooks/lens/graphql/generated";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import { Typography } from "../../ui/Typography";
import {
  ExchangeName,
  Items,
  ItemsDates,
  ItemsGrid,
  ItemsName,
  MessageInfo,
  OfferImage
} from "./SellerDashboard.styles";

interface Props {
  name: string;
  items: Exchange[];
  sellerLensProfile?: Profile;
  onClick?: () => void;
}

const ItemDates = (item: Exchange, type: string) => {
  const component = () =>
    ({
      [subgraph.ExchangeState.COMMITTED]: {
        first: {
          label: "Expires",
          value: item?.offer?.validUntilDate
            ? formatDate(getDateTimestamp(item?.offer?.validUntilDate), {
                textIfTooBig: NO_EXPIRATION
              })
            : ""
        },
        second: {
          label:
            item?.offer?.voucherRedeemableUntilDate !== "0"
              ? "Redeemable until"
              : "Redeemable for",
          value:
            item?.offer?.voucherRedeemableUntilDate !== "0"
              ? dayjs(
                  getDateTimestamp(item?.offer?.voucherRedeemableUntilDate)
                ).format(CONFIG.dateFormat)
              : `${
                  Number(`${item.offer.voucherValidDuration}000`) / 86400000
                } days`
        }
      },
      [subgraph.ExchangeState.REDEEMED]: {
        first: {
          label: "Redeemed",
          value: item?.redeemedDate
            ? dayjs(getDateTimestamp(item?.redeemedDate)).format(
                CONFIG.dateFormat
              )
            : ""
        },
        second: {
          label: "Finalized",
          value: item?.finalizedDate
            ? dayjs(getDateTimestamp(item?.finalizedDate)).format(
                CONFIG.dateFormat
              )
            : ""
        }
      },
      [subgraph.ExchangeState.DISPUTED]: {
        first: {
          label: "Dispute raised",
          value: item?.disputedDate
            ? dayjs(getDateTimestamp(item?.disputedDate)).format(
                CONFIG.dateFormat
              )
            : ""
        },
        second: {
          label: "Dispute ends",
          value:
            item?.disputedDate && item?.offer?.disputePeriodDuration
              ? dayjs(
                  getDateTimestamp(
                    (
                      Number(item?.disputedDate) +
                      Number(item?.offer?.disputePeriodDuration)
                    ).toString()
                  )
                ).format(CONFIG.dateFormat)
              : ""
        }
      }
    }[type]);

  return component();
};
export default function SellerDashboardItems({
  items,
  name,
  sellerLensProfile,
  onClick
}: Props) {
  return (
    <>
      <ItemsName onClick={onClick}>
        <Typography tag="h4" margin="0" padding="0">
          {name}
        </Typography>
        <ArrowRight size={16} />
      </ItemsName>
      <Items gap="1rem" flexDirection="column" alignItems="stretch">
        {items.length === 0 && (
          <Typography tag="p">No items to display</Typography>
        )}
        {items.map((item: Exchange) => {
          const itemDate = ItemDates(item, item?.state);
          const { mainImage } = getOfferDetails(item.offer.metadata);

          return (
            <ItemsGrid key={`dashboard_items_${item?.id}`}>
              <OfferImage>
                <Image src={mainImage} />
              </OfferImage>
              <MessageInfo>
                <ExchangeName>{item?.offer?.metadata?.name}</ExchangeName>
                <SellerID
                  offerMetadata={item?.offer.metadata}
                  accountToShow={item?.seller}
                  withProfileImage
                  onClick={() => null}
                  withBosonStyles
                  lensProfile={sellerLensProfile}
                />
                <div>
                  {itemDate?.first?.value && (
                    <ItemsDates>
                      <span>{itemDate.first.label}</span>
                      <span>{itemDate.first.value}</span>
                    </ItemsDates>
                  )}
                  {itemDate?.second?.value && (
                    <ItemsDates>
                      <span>{itemDate.second.label}</span>
                      <span>{itemDate.second.value}</span>
                    </ItemsDates>
                  )}
                </div>
              </MessageInfo>
            </ItemsGrid>
          );
        })}
      </Items>
    </>
  );
}
