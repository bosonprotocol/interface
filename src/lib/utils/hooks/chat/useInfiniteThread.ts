import {
  MessageData,
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/esm/util/validators";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import { ThreadObjectWithInfo } from "../../../../pages/chat/types";
import {
  DateStep,
  getDedupSortedMessages,
  getTimes,
  mergeThreads
} from "./common";

interface Props {
  dateStep: DateStep;
  dateStepValue?: number;
  counterParty: string;
  threadId: ThreadId | null | undefined;
  genesisDate: Date;
  onMessagesReceived: (messages: MessageData[]) => void;
  onFinishFetching: (arg: {
    isLoading: boolean;
    isError: boolean;
    isBeginningOfTimes: boolean;
    lastData: ThreadObject | null;
  }) => void;
}

const createWorker = createWorkerFactory(() => import("./getThreadWorker"));

export function useInfiniteThread({
  dateStep,
  dateStepValue = 1,
  counterParty,
  threadId,
  genesisDate,
  onMessagesReceived,
  onFinishFetching
}: Props): {
  data: ThreadObjectWithInfo | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isBeginningOfTimes: boolean;
  lastData: ThreadObject | null;
  addToDateIndex: (toAdd: number) => void;
  setDateIndex: (index: number) => void;
  appendMessages: (messages: ThreadObjectWithInfo["messages"]) => void;
  removePendingMessage: (uuid: string) => void;
} {
  const worker = useWorker(createWorker);
  const [dateIndex, setDateIndex] = useState<{
    index: number;
    trigger: boolean;
  }>({
    index: 0,
    trigger: true
  });
  const { address } = useAccount();
  const { bosonXmtp } = useChatContext();
  const [areThreadsLoading, setThreadsLoading] = useState<boolean>(false);
  const [threadXmtp, setThreadXmtp] = useState<ThreadObjectWithInfo | null>(
    null
  );
  const [lastThreadXmtp, setLastThreadXmtp] = useState<ThreadObject | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isBeginningOfTimes, setIsBeginningOfTimes] = useState<boolean>(false);

  useEffect(() => {
    if (
      !bosonXmtp ||
      !threadId ||
      !counterParty ||
      !dateIndex.trigger ||
      !window.navigator.onLine
    ) {
      return;
    }
    if (dateIndex.index > 0) {
      return;
    }
    const now = new Date();
    const { isBeginning } = getTimes({
      dateIndex: dateIndex.index,
      dateStep,
      dateStepValue,
      from: now,
      genesisDate
    });
    setIsBeginningOfTimes(isBeginning);
    if (isBeginning) {
      return;
    }
    setThreadsLoading(true);

    setError(null);

    worker
      .getThread({
        bosonXmtp,
        threadId,
        counterParty: utils.getAddress(counterParty),
        dateIndex: dateIndex.index,
        dateStep,
        dateStepValue,
        now,
        genesisDate,
        onMessageReceived: async (threadObject) => {
          // TODO: if a new proposal is received, the old ones of the same party get expired
          if (threadObject) {
            console.log("threadObject", threadObject);
            await setIsValidToMessages(threadObject as ThreadObjectWithInfo);
            onMessagesReceived(structuredClone(threadObject).messages);

            setThreadXmtp((prevThread) => {
              const mergedThreads = mergeThreads(
                prevThread ? prevThread : null,
                threadObject
              );
              const newThreadXmtp = mergedThreads as ThreadObjectWithInfo;

              return newThreadXmtp;
            });
          }
        }
      })
      .then(
        async ({
          thread: threadObject,
          dateIndex: iDateIndex,
          isBeginning
        }) => {
          setIsBeginningOfTimes(isBeginning);
          setLastThreadXmtp(threadObject);
          setDateIndex({
            index: iDateIndex,
            trigger: false
          });

          setThreadsLoading(false);
          onFinishFetching({
            isBeginningOfTimes: isBeginning,
            isLoading: false,
            isError: false,
            lastData: threadObject
          });
        }
      )
      .catch((err) => {
        setError(err);
        setThreadsLoading(false);
        onFinishFetching({
          isLoading: false,
          isError: !!err,
          isBeginningOfTimes: isBeginning,
          lastData: lastThreadXmtp
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bosonXmtp,
    dateIndex,
    counterParty,
    dateStep,
    threadId,
    address,
    onMessagesReceived
  ]);
  return {
    data: threadXmtp || null,
    isLoading: areThreadsLoading,
    isError: !!error,
    error,
    isBeginningOfTimes,
    lastData: lastThreadXmtp || null,
    addToDateIndex: useCallback((toAdd: number) => {
      setDateIndex((prev) => ({
        index: prev.index + toAdd,
        trigger: true
      }));
    }, []),
    setDateIndex: useCallback((index: number) => {
      setDateIndex({
        index,
        trigger: true
      });
    }, []),
    appendMessages: useCallback(
      (messages): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setThreadXmtp((newThread) => {
          const oldMessages = newThread?.messages || [];

          const dedupSortedMessages = getDedupSortedMessages(
            oldMessages,
            messages
          );
          return {
            ...(newThread || {}),
            threadId: newThread?.threadId || threadId,
            messages: dedupSortedMessages
          };
        });
      },
      [threadId]
    ),
    removePendingMessage: useCallback(
      (uuid: string): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setThreadXmtp((newThread) => {
          return {
            ...(newThread || {}),
            threadId: newThread?.threadId || threadId,
            messages:
              newThread?.messages.filter((message) => {
                return message.uuid !== uuid;
              }) || []
          };
        });
      },
      [threadId]
    )
  };
}

const setIsValidToMessages = async (newThreadXmtp: ThreadObjectWithInfo) => {
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
