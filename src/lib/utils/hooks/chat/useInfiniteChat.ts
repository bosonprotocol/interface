import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { ThreadObject } from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/functions";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  dateStep: "day" | "week" | "month" | "year";
  counterParties: string[];
  dateIndex: number;
  bosonXmtp: BosonXmtpClient | undefined;
}
const requestedData = new Map<string, boolean>();
const genesisDate = new Date("2022-07-28"); // TODO: change
export function useInfiniteChat({
  dateStep,
  dateIndex,
  counterParties,
  bosonXmtp
}: Props) {
  const [areThreadsLoading, setThreadsLoading] = useState<boolean>(false);
  const [threadsXmtp, setThreadsXmtp] = useState<ThreadObject[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isBeginningOfTimes, setIsBeginningOfTimes] = useState<boolean>(false);
  useEffect(() => {
    if (!bosonXmtp) {
      return;
    }
    if (dateIndex > 0) {
      return;
    }
    // endTime, startTime
    // abans dahir, ahir
    // ahir, avui
    const endTime = dayjs()
      .add(dateIndex - 1, dateStep)
      .toDate();
    const startTime = dayjs(endTime).add(1, dateStep).toDate();
    const key = `${dayjs(startTime).format("YYYY-MM-DD")}-${dayjs(
      endTime
    ).format("YYYY-MM-DD")}`;
    console.log(
      "threads from",
      dayjs(startTime).format("YYYY-MM-DD"),
      "to",
      dayjs(endTime).format("YYYY-MM-DD")
    );
    const isBeginning =
      dayjs(startTime).isBefore(genesisDate) ||
      dayjs(startTime).isSame(genesisDate, "day");
    setIsBeginningOfTimes(isBeginning);
    if (isBeginning) {
      console.log("threads reached beginning!", { startTime, genesisDate });
      return;
    }
    if (requestedData.has(key)) {
      return;
    }
    requestedData.set(key, true);
    console.log("requesting threads from", startTime, "until", endTime);
    setThreadsLoading(true);

    bosonXmtp
      .getThreads(counterParties, {
        startTime: endTime,
        endTime: startTime
      })
      .then((threadObjects) => {
        const mergedThreads = mergeThreads(threadsXmtp, threadObjects);
        console.log(
          "threadObjects",
          threadObjects,
          "mergedThreads",
          mergedThreads
        );
        setThreadsXmtp(mergedThreads);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setThreadsLoading(false);
      });
  }, [bosonXmtp, dateIndex, threadsXmtp, counterParties, dateStep]);

  return {
    data: threadsXmtp,
    isLoading: areThreadsLoading,
    isError: !!error,
    error,
    isBeginningOfTimes
  };
}

const mergeThreads = (
  threadsA: ThreadObject[],
  threadsB: ThreadObject[]
): ThreadObject[] => {
  const resultingThreads = [...threadsA];
  if (!resultingThreads.length) {
    return [...threadsB];
  }
  for (const thread of resultingThreads) {
    const matchingThread = threadsB.find((threadB) =>
      matchThreadIds(thread.threadId, threadB.threadId)
    );
    if (matchingThread) {
      // messages in matchingThread should be all after or all before the messages in thread
      if (thread.messages.length && matchingThread.messages.length) {
        const afterFirst =
          thread.messages[0].timestamp >= matchingThread.messages[0].timestamp;
        const afterLast =
          thread.messages[thread.messages.length - 1].timestamp >=
          matchingThread.messages[matchingThread.messages.length - 1].timestamp;
        if (afterFirst && afterLast) {
          thread.messages = [...matchingThread.messages, ...thread.messages];
        } else if (!afterFirst && !afterLast) {
          thread.messages = [...thread.messages, ...matchingThread.messages];
        } else {
          throw new Error(
            `Overlapping messages in threads with id ${JSON.stringify(
              thread.threadId
            )} ${JSON.stringify({ afterFirst, afterLast })}`
          );
        }
      } else {
        thread.messages = matchingThread.messages || [];
      }
    }
  }
  return resultingThreads;
};
