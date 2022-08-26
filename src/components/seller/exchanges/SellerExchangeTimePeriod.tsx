import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo } from "react";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import Typography from "../../ui/Typography";

interface Props {
  exchange: any;
}
export default function SellerExchangeTimePeriod({ exchange }: Props) {
  const status = ExchangesKit.getExchangeState(exchange);

  const renderValues = useMemo(
    () =>
      ({
        [subgraph.ExchangeState.Committed]: {
          text: "Redeemable Until",
          value: dayjs(
            getDateTimestamp(exchange?.offer?.voucherRedeemableUntilDate)
          ).format(CONFIG.dateFormat)
        },
        [subgraph.ExchangeState.Disputed]: {
          text: "Resolution period ends",
          // TODO: disputedDate + resolutionPeriodDuration
          value: dayjs().format(CONFIG.dateFormat)
        },
        [subgraph.ExchangeState.Redeemed]: {
          text: "Dispute period ends",
          // TODO: redeemedDate + fulfillmentPeriodDuration
          value: dayjs().format(CONFIG.dateFormat)
        },
        [subgraph.ExchangeState.Completed]: {
          text: "Expired on",
          value: dayjs(getDateTimestamp(exchange?.validUntilDate)).format(
            CONFIG.dateFormat
          )
        },
        [ExchangesKit.ExtendedExchangeState.Expired]: {
          text: "Expired on",
          value: dayjs(getDateTimestamp(exchange?.validUntilDate)).format(
            CONFIG.dateFormat
          )
        },
        // rest of them
        [subgraph.ExchangeState.Revoked]: {
          display: false
        },
        [subgraph.ExchangeState.Cancelled]: {
          display: false
        },
        [ExchangesKit.ExtendedExchangeState.NotRedeemableYet]: {
          display: false
        }
      }[status]),
    [status, exchange]
  );

  return (
    renderValues?.display !== false && (
      <Typography>
        <span>
          <small style={{ margin: "0" }}>{renderValues?.text}</small>
          <br />
          {renderValues?.value}
        </span>
      </Typography>
    )
  );
}
