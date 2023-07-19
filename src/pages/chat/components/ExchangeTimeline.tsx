/* eslint @typescript-eslint/no-explicit-any: "off" */
import {
  MessageData,
  MessageType
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
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
  lastReceivedProposal?: MessageData | null;
  lastSentProposal?: MessageData | null;
}

export default function ExchangeTimeline({
  children,
  exchange,
  showDispute = true,
  lastReceivedProposal,
  lastSentProposal
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
    if (
      lastReceivedProposal &&
      [MessageType.CounterProposal].includes(
        lastReceivedProposal.data.contentType
      )
    ) {
      const timestamp = Number(lastReceivedProposal.timestamp) / 1000;
      timesteps.push({
        text: `Last ${
          lastReceivedProposal.data.contentType === MessageType.Proposal
            ? "proposal"
            : "counterproposal"
        } received`,
        date: formatShortDate(timestamp.toString()),
        timestamp
      });
    }
    if (
      lastSentProposal &&
      [MessageType.CounterProposal].includes(lastSentProposal.data.contentType)
    ) {
      const timestamp = Number(lastSentProposal.timestamp) / 1000;
      timesteps.push({
        text: `Last ${
          lastSentProposal.data.contentType === MessageType.Proposal
            ? "proposal"
            : "counterproposal"
        } sent`,
        date: formatShortDate(timestamp.toString()),
        timestamp
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
          text: "Dispute raised",
          date: formatShortDate(disputedDate),
          timestamp: Number(disputedDate)
        });
      }
      if (retractedDate) {
        timesteps.push({
          text: "Dispute retracted",
          date: formatShortDate(retractedDate),
          timestamp: Number(retractedDate)
        });
      }
      if (resolvedDate) {
        timesteps.push({
          text: "Dispute mutually resolved",
          date: formatShortDate(resolvedDate),
          timestamp: Number(resolvedDate)
        });
      }
      if (refusedDate) {
        timesteps.push({
          text: "Dispute refused",
          date: formatShortDate(refusedDate),
          timestamp: Number(refusedDate)
        });
      }
      if (decidedDate) {
        timesteps.push({
          text: "Dispute decided",
          date: formatShortDate(decidedDate),
          timestamp: Number(decidedDate)
        });
      }
      if (escalatedDate) {
        timesteps.push({
          text: "Dispute escalated",
          date: formatShortDate(escalatedDate),
          timestamp: Number(escalatedDate)
        });
      }
    }

    return timesteps.sort((a, b) => a.timestamp - b.timestamp);
  }, [exchange, lastReceivedProposal, lastSentProposal, showDispute, dispute]);

  return (
    <>
      {!!timesteps.length && children}
      <Timeline timesteps={timesteps} />
    </>
  );
}
