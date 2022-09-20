import { ThreadObject } from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/functions";
import dayjs from "dayjs";

import { genesisDate } from "./const";

export type DateStep = "hour" | "day" | "week" | "month" | "year";
export const getTimes = (dateIndex: number, dateStep: DateStep) => {
  const startTime = dayjs()
    .add(dateIndex - 1, dateStep)
    .toDate();
  const endTime = dayjs(startTime).add(1, dateStep).toDate();
  return {
    startTime,
    endTime,
    isBeginning: dayjs(startTime).isBefore(genesisDate)
  };
};

export const mergeThreads = (
  threadA: ThreadObject | null | undefined,
  threadB: ThreadObject | null | undefined
): ThreadObject | null => {
  if (!threadA && !threadB) {
    return null;
  } else if (!threadA && threadB) {
    return { ...threadB };
  } else if (threadA && !threadB) {
    return { ...threadA };
  }
  const thA = threadA as ThreadObject;
  const thB = threadB as ThreadObject;
  const resultingThread = { ...thA };

  const matchingThread = matchThreadIds(resultingThread.threadId, thB.threadId)
    ? thB
    : null;
  if (matchingThread) {
    // messages in matchingThread should be all after or all before the messages in resultingThread
    if (resultingThread.messages.length && matchingThread.messages.length) {
      const afterFirst =
        resultingThread.messages[0].timestamp >=
        matchingThread.messages[0].timestamp;
      const afterLast =
        resultingThread.messages[resultingThread.messages.length - 1]
          .timestamp >=
        matchingThread.messages[matchingThread.messages.length - 1].timestamp;
      if (afterFirst && afterLast) {
        resultingThread.messages = [
          ...matchingThread.messages,
          ...resultingThread.messages
        ];
      } else if (!afterFirst && !afterLast) {
        resultingThread.messages = [
          ...resultingThread.messages,
          ...matchingThread.messages
        ];
      } else {
        throw new Error(
          `Overlapping messages in threads with id ${JSON.stringify(
            resultingThread.threadId
          )} ${JSON.stringify({ afterFirst, afterLast })}`
        );
      }
    } else {
      resultingThread.messages = matchingThread.messages || [];
    }
  }

  return resultingThread;
};
