/* eslint @typescript-eslint/no-explicit-any: "off" */
import dayjs from "dayjs";
import { ReactNode, useMemo } from "react";

import Timeline from "../../../components/timeline/Timeline";
import { CONFIG } from "../../../lib/config";
import { useDisputes } from "../../../lib/utils/hooks/useDisputes";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";

const formatShortDate = (date: string) => {
  return date
    ? dayjs(new Date(Number(date) * 1000)).format(
        `${CONFIG.shortDateFormat} HH:mm`
      )
    : "";
};

interface Props {
  exchange: Exchange | any;
  children?: ReactNode;
  showDispute?: boolean;
}

export default function ExchangeTimeline({
  children,
  exchange,
  showDispute = true
}: Props) {
  const { data: disputes = [] } = useDisputes(
    {
      disputesFilter: {
        exchange: exchange?.id
      }
    },
    { enabled: !!exchange?.id && showDispute }
  );
  const [dispute] = disputes;

  const timesteps = useMemo(() => {
    const { committedDate, redeemedDate, cancelledDate, revokedDate } =
      exchange;

    const timesteps: { text: string; date: string; timestamp: number }[] = [];
    if (committedDate) {
      timesteps.push({
        text: "Committed",
        date: formatShortDate(committedDate),
        timestamp: Number(committedDate)
      });
    }
    if (redeemedDate) {
      timesteps.push({
        text: "Redeemed",
        date: formatShortDate(redeemedDate),
        timestamp: Number(redeemedDate)
      });
    }
    if (cancelledDate) {
      timesteps.push({
        text: "Cancelled",
        date: formatShortDate(cancelledDate),
        timestamp: Number(cancelledDate)
      });
    }
    if (revokedDate) {
      timesteps.push({
        text: "Revoked",
        date: formatShortDate(revokedDate),
        timestamp: Number(revokedDate)
      });
    }
    if (showDispute && dispute) {
      const {
        disputedDate,
        retractedDate,
        resolvedDate,
        decidedDate,
        refusedDate,
        escalatedDate
      } = dispute;

      if (disputedDate) {
        timesteps.push({
          text: "Dispute Raised",
          date: formatShortDate(disputedDate),
          timestamp: Number(disputedDate)
        });
      }
      if (retractedDate) {
        timesteps.push({
          text: "Dispute Retracted",
          date: formatShortDate(retractedDate),
          timestamp: Number(retractedDate)
        });
      }
      if (resolvedDate) {
        timesteps.push({
          text: "Dispute Mutually Resolved",
          date: formatShortDate(resolvedDate),
          timestamp: Number(resolvedDate)
        });
      }
      if (refusedDate) {
        timesteps.push({
          text: "Dispute Refused",
          date: formatShortDate(refusedDate),
          timestamp: Number(refusedDate)
        });
      }
      if (decidedDate) {
        timesteps.push({
          text: "Dispute Decided",
          date: formatShortDate(decidedDate),
          timestamp: Number(decidedDate)
        });
      }
      if (escalatedDate) {
        timesteps.push({
          text: "Dispute Escalated",
          date: formatShortDate(escalatedDate),
          timestamp: Number(escalatedDate)
        });
      }
    }

    return timesteps.sort((a, b) => a.timestamp - b.timestamp);
  }, [exchange, dispute, showDispute]);

  return (
    <>
      {!!timesteps.length && children}
      <Timeline timesteps={timesteps} />
    </>
  );
}
