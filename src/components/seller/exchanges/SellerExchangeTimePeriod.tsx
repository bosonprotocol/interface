import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { NO_EXPIRATION } from "lib/constants/offer";
import { formatDate } from "lib/utils/date";
import { useMemo } from "react";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { Typography } from "../../ui/Typography";

interface Props {
  exchange: Exchange;
}
export default function SellerExchangeTimePeriod({ exchange }: Props) {
  const renderValues = useMemo(() => {
    const { offer } = exchange;
    const status = ExchangesKit.getExchangeState(exchange);
    const redeemableForXDays =
      Number(`${offer.voucherValidDuration}000`) / 86400000;
    return {
      [subgraph.ExchangeState.COMMITTED]:
        offer.voucherRedeemableUntilDate !== "0"
          ? {
              text: "Redeemable Until",
              value: dayjs(
                getDateTimestamp(offer.voucherRedeemableUntilDate)
              ).format(CONFIG.dateFormat)
            }
          : {
              text: "Redeemable for",
              value: `${redeemableForXDays} day${
                redeemableForXDays === 1 ? "" : "s"
              }`
            },
      [subgraph.ExchangeState.DISPUTED]: {
        text: "Resolution period ends",
        value: dayjs(
          getDateTimestamp(
            `${
              parseInt(exchange?.disputedDate || "0") +
              parseInt(exchange?.offer?.resolutionPeriodDuration)
            }`
          )
        ).format(CONFIG.dateFormat)
      },
      [subgraph.ExchangeState.REDEEMED]: {
        text: "Dispute period ends",
        value: dayjs(
          getDateTimestamp(
            `${
              parseInt(exchange?.redeemedDate || "0") +
              parseInt(exchange?.offer?.disputePeriodDuration)
            }`
          )
        ).format(CONFIG.dateFormat)
      },
      [subgraph.ExchangeState.COMPLETED]: {
        text: "Expired on",
        value: formatDate(getDateTimestamp(exchange?.validUntilDate), {
          textIfTooBig: NO_EXPIRATION
        })
      },
      [ExchangesKit.ExtendedExchangeState.Expired]: {
        text: "Expired on",
        value: formatDate(getDateTimestamp(exchange?.validUntilDate), {
          textIfTooBig: NO_EXPIRATION
        })
      },
      // rest of them
      [subgraph.ExchangeState.REVOKED]: {
        display: false
      },
      [subgraph.ExchangeState.CANCELLED]: {
        display: false
      },
      [ExchangesKit.ExtendedExchangeState.NotRedeemableYet]: {
        display: false
      }
    }[status];
  }, [exchange]);

  return (
    <Typography>
      {renderValues?.display !== false && (
        <span>
          <small style={{ margin: "0" }}>{renderValues?.text}</small>
          <br />
          {renderValues?.value}
        </span>
      )}
    </Typography>
  );
}
