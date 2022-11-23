import {
  MessageData,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/functions";
import dayjs from "dayjs";

export type DateStep =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";
export const getTimes = ({
  dateIndex,
  dateStep,
  dateStepValue = 1,
  from,
  genesisDate
}: {
  dateIndex: number;
  dateStep: DateStep;
  dateStepValue: number;
  from: Date;
  genesisDate: Date;
}) => {
  const startTime = dayjs(from)
    .add((dateIndex - 1) * dateStepValue, dateStep)
    .toDate();
  const endTime = dayjs(startTime).add(dateStepValue, dateStep).toDate();
  return {
    startTime,
    endTime,
    isBeginning: dayjs(endTime).isBefore(genesisDate),
    dateStep,
    dateStepValue,
    genesisDate
  };
};

export const getSmallerDateStep = (dateStep: DateStep): DateStep => {
  switch (dateStep) {
    case "year":
      return "month";
    case "month":
      return "week";
    case "week":
      return "day";
    case "day":
      return "hour";
    case "hour":
      return "minute";
    default:
      return "second";
  }
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
    if (resultingThread.messages.length && matchingThread.messages.length) {
      const dedupSortedMessages = getDedupSortedMessages(
        resultingThread.messages,
        matchingThread.messages
      );
      resultingThread.messages = dedupSortedMessages;
    } else {
      resultingThread.messages = matchingThread.messages || [];
    }
  }

  return resultingThread;
};

export function getDedupSortedMessages(
  messagesA: MessageData[],
  messagesB: MessageData[]
): MessageData[] {
  const allMessagesIncludingDuplicates = [...messagesA, ...messagesB];

  const seenMessagesSet = new Set();
  const uniqueMessages = allMessagesIncludingDuplicates.filter((message) => {
    const id = message.timestamp;
    const duplicate = seenMessagesSet.has(id);
    seenMessagesSet.add(id);
    return !duplicate;
  });
  return uniqueMessages.sort((msgA, msgB) => msgA.timestamp - msgB.timestamp);
}
