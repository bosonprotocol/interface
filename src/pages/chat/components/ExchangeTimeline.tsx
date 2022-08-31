import dayjs from "dayjs";
import { useMemo } from "react";

import Timeline from "../../../components/timeline/Timeline";
import { CONFIG } from "../../../lib/config";
import { useDisputes } from "../../../lib/utils/hooks/useDisputes";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";

const formatShortDate = (date: string) => {
  return date
    ? dayjs(new Date(Number(date) * 1000)).format(CONFIG.shortDateFormat)
    : "";
};

interface Props {
  exchange: Exchange;
}

export default function ExchangeTimeline({ exchange }: Props) {
  const { data: disputes = [] } = useDisputes({
    disputesFilter: {
      exchange: exchange.id
    }
  });
  const [dispute] = disputes;
  const timesteps = useMemo(() => {
    const { committedDate, redeemedDate } = exchange;
    const timesteps = [];
    if (committedDate) {
      timesteps.push({
        text: "Committed",
        date: formatShortDate(committedDate)
      });
    }
    if (redeemedDate) {
      timesteps.push({ text: "Redeemed", date: formatShortDate(redeemedDate) });
    }
    if (dispute) {
      const { disputedDate, retractedDate, resolvedDate } = dispute;
      if (disputedDate) {
        timesteps.push({
          text: "Dispute Raised",
          date: formatShortDate(disputedDate)
        });
      }
      if (retractedDate) {
        timesteps.push({
          text: "Dispute Retracted",
          date: formatShortDate(retractedDate)
        });
      }
      if (resolvedDate) {
        timesteps.push({
          text: "Dispute Mutually Resolved",
          date: formatShortDate(resolvedDate)
        });
      }
    }

    return timesteps;
  }, [exchange, dispute]);
  return (
    <>
      <Timeline timesteps={timesteps} />
    </>
  );
}
