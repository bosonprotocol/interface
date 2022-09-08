import {
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/functions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/cjs/util/validators";
import dayjs from "dayjs";
import { utils } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import { ThreadObjectWithIsValid } from "../../../../pages/chat/types";

interface Props {
  dateStep: "day" | "week" | "month" | "year";
  counterParty: string;
  threadId: ThreadId | null | undefined;
  dateIndex: number;
  onFinishFetching: () => void;
}
const genesisDate = new Date("2022-08-15");
export function useInfiniteThread({
  dateStep,
  dateIndex,
  counterParty,
  threadId,
  onFinishFetching
}: Props): {
  data: ThreadObjectWithIsValid | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isBeginningOfTimes: boolean;
  lastData: ThreadObject | null;
  appendMessages: (messages: ThreadObjectWithIsValid["messages"]) => void;
} {
  const { bosonXmtp } = useChatContext();
  const [areThreadsLoading, setThreadsLoading] = useState<boolean>(false);
  const [threadXmtp, setThreadXmtp] = useState<ThreadObjectWithIsValid | null>(
    null
  );
  const [lastThreadXmtp, setLastThreadXmtp] = useState<ThreadObject | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isBeginningOfTimes, setIsBeginningOfTimes] = useState<boolean>(false);
  useEffect(() => {
    if (!bosonXmtp || !threadId || !counterParty) {
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
      return;
    }
    setThreadsLoading(true);

    setError(null);
    bosonXmtp
      .getThread(threadId, utils.getAddress(counterParty), {
        startTime: endTime,
        endTime: startTime
      })
      .then(async (threadObject) => {
        setLastThreadXmtp(threadObject);
        if (!threadObject) {
          return;
        }
        const mergedThreads = mergeThreads(threadXmtp ? [threadXmtp] : [], [
          threadObject
        ]);
        const newThreadXmtp = mergedThreads[0] as ThreadObjectWithIsValid;

        await setIsValidToMessages(newThreadXmtp);

        setThreadXmtp(newThreadXmtp);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setThreadsLoading(false);
        onFinishFetching();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosonXmtp, dateIndex, counterParty, dateStep, threadId]);

  return {
    data: threadXmtp || null,
    isLoading: areThreadsLoading,
    isError: !!error,
    error,
    isBeginningOfTimes,
    lastData: lastThreadXmtp || null,
    appendMessages: useCallback((messages): void => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setThreadXmtp((newThread) => {
        const oldMessages = newThread?.messages || [];
        const allMessagesIncludingDuplicates = [...oldMessages, ...messages];

        const seenMessagesSet = new Set();
        const uniqueMessages = allMessagesIncludingDuplicates.filter(
          (message) => {
            const id = message.timestamp;
            const duplicate = seenMessagesSet.has(id);
            seenMessagesSet.add(id);
            return !duplicate;
          }
        );
        return {
          ...(newThread || {}),
          messages: uniqueMessages.sort(
            (msgA, msgB) => msgA.timestamp - msgB.timestamp
          )
        };
      });
    }, [])
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

const setIsValidToMessages = async (newThreadXmtp: ThreadObjectWithIsValid) => {
  const promises = [];
  for (const message of newThreadXmtp.messages) {
    promises.push(
      message.isValid === undefined
        ? validateMessage(message.data)
        : message.isValid
    );
  }

  const promisesResults = await Promise.all(promises);

  for (let i = 0; i < promisesResults.length; i++) {
    const promiseResult = promisesResults[i];
    const message = newThreadXmtp.messages[i];
    message.isValid = promiseResult;
  }
};
