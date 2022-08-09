import {
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/functions";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";

interface Props {
  dateStep: "day" | "week" | "month" | "year";
  counterParty: string;
  threadId: ThreadId | null | undefined;
  dateIndex: number;
  onFinishFetching: () => void;
}
const genesisDate = new Date("2022-07-28"); // TODO: change
export function useInfiniteThread({
  dateStep,
  dateIndex,
  counterParty,
  threadId,
  onFinishFetching
}: Props): {
  data: ThreadObject | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isBeginningOfTimes: boolean;
  lastData: ThreadObject | null;
} {
  const { bosonXmtp } = useChatContext();
  const [areThreadsLoading, setThreadsLoading] = useState<boolean>(false);
  const [threadsXmtp, setThreadsXmtp] = useState<ThreadObject[]>([]);
  const [lastThreadXmtp, setLastThreadXmtp] = useState<ThreadObject | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isBeginningOfTimes, setIsBeginningOfTimes] = useState<boolean>(false);
  useEffect(() => {
    if (!bosonXmtp || !threadId) {
      return;
    }
    if (dateIndex > 0) {
      return;
    }
    const endTime = dayjs()
      .add(dateIndex - 1, dateStep)
      .toDate();
    const startTime = dayjs(endTime).add(1, dateStep).toDate();
    const isBeginning =
      dayjs(startTime).isBefore(genesisDate) ||
      dayjs(startTime).isSame(genesisDate, "day");
    setIsBeginningOfTimes(isBeginning);
    if (isBeginning) {
      console.log("threads reached beginning!", {
        startTime,
        genesisDate,
        threadId
      });
      return;
    }
    setThreadsLoading(true);

    console.log("requesting threads from", startTime, "until", endTime, {
      threadId,
      counterParty,
      areThreadsLoading
    });
    bosonXmtp
      .getThread(threadId, counterParty, {
        startTime: endTime,
        endTime: startTime,
        pageSize: 100
      })
      .then((threadObject) => {
        console.log(
          "FINISH requesting threads from",
          startTime,
          "until",
          endTime,
          {
            threadId,
            counterParty,
            threadObject: !!threadObject
          }
        );
        setLastThreadXmtp(threadObject);
        if (!threadObject) {
          return;
        }
        const mergedThreads = mergeThreads(threadsXmtp, [threadObject]);
        setThreadsXmtp(mergedThreads);
      })
      .catch((err) => {
        console.error(
          // `Error while requesting threadId: ${JSON.stringify(threadId)}`,
          err
        );
        setError(err);
      })
      .finally(() => {
        setThreadsLoading(false);
        onFinishFetching();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosonXmtp, dateIndex, counterParty, dateStep, threadId]);

  return {
    data: threadsXmtp[0] || null,
    isLoading: areThreadsLoading,
    isError: !!error,
    error,
    isBeginningOfTimes,
    lastData: lastThreadXmtp || null
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
