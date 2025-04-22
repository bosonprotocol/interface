import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import {
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import dayjs from "dayjs";
import { MutableRefObject } from "react";

import { DateStep, getSmallerDateStep, getTimes, mergeThreads } from "./common";

type Time = ReturnType<typeof getTimes>;
const concurrency = 4;

/**
 * Loads a thread until it finds a message
 * @param
 * @returns
 */
export async function getThread({
  bosonXmtp,
  threadId,
  counterParty,
  dateIndex,
  dateStep,
  dateStepValue,
  now,
  genesisDate,
  onMessageReceived,
  checkCustomCondition,
  stopRef
}: {
  bosonXmtp: BosonXmtpClient;
  threadId: ThreadId;
  counterParty: string;
  dateIndex: number;
  dateStep: DateStep;
  dateStepValue: number;
  now: Date;
  genesisDate: Date;
  onMessageReceived: (currentThread: ThreadObject | null) => Promise<void>;
  checkCustomCondition?: (mergedThread: ThreadObject | null) => boolean;
  stopRef?: MutableRefObject<boolean>;
}): Promise<{
  thread: ThreadObject | null;
  dateIndex: number;
  isBeginning: boolean;
}> {
  checkDateStepValue(dateStepValue);
  let iDateIndex = dateIndex;

  let threadsWithMessages: ThreadObject[] = [];

  let isBeginning = false;
  let anyMessage = false;
  let failedTimesArray: Time[] = [];
  let oldestThread: ThreadObject | null = null;
  let customConditionMet = false;
  do {
    const failedTimes = getTimesInFailedPeriod(failedTimesArray)
      .flat()
      .filter((v): v is Time => !!v);
    const timesArrayInRange: Time[] =
      isBeginning || failedTimes.length || !window.navigator.onLine
        ? []
        : new Array(concurrency).fill(0).map((_, index) => {
            return getTimes({
              dateIndex: iDateIndex - index,
              dateStep,
              dateStepValue,
              from: now,
              genesisDate
            });
          });
    console.log(
      "timesArrayInRange",
      timesArrayInRange,
      "failedTimes",
      failedTimes
    );
    const timesArray = [...timesArrayInRange, ...failedTimes];
    failedTimesArray = [];
    const promises = timesArray.map((times) => {
      if (times.isBeginning) {
        return null;
      }
      return () => {
        return bosonXmtp.getThread(threadId, counterParty, {
          sentAfterNs: BigInt(times.startTime.getTime()) * BigInt(1_000_000),
          sentBeforeNs: BigInt(times.endTime.getTime()) * BigInt(1_000_000)
        });
      };
    });
    if (!promises.filter((v) => !!v).length) {
      return { thread: null, dateIndex: iDateIndex, isBeginning };
    }
    const settledThreads = await allSettled(
      promises.map((p) => {
        if (!p) {
          return () => null;
        }
        return p;
      })
    );
    const threads = settledThreads
      .filter(
        (result, index): result is PromiseFulfilledResult<ThreadObject> => {
          const isFulfilled = result.status === "fulfilled";
          if (!isFulfilled) {
            failedTimesArray.push(timesArray[index]);
          }
          return isFulfilled;
        }
      )
      .map((result) => {
        const currentThread = result.value;
        if (oldestThread) {
          if (
            oldestThread.messages[0]?.timestamp >
            currentThread?.messages[0]?.timestamp
          ) {
            oldestThread = currentThread;
          }
        } else {
          oldestThread = currentThread;
        }
        return currentThread;
      });
    isBeginning =
      isBeginning || !!timesArray.find((times) => times.isBeginning);

    threadsWithMessages = threads.filter((thread) => !!thread?.messages.length);
    if (threadsWithMessages.length) {
      const merged = mergeListOfThreads(threadsWithMessages);
      onMessageReceived(merged);
      if (checkCustomCondition) {
        customConditionMet = checkCustomCondition(merged);
      }
    }
    anyMessage = anyMessage || !!threadsWithMessages.length;
    iDateIndex -= concurrency;
  } while (
    window.navigator.onLine &&
    !stopRef?.current &&
    ((!customConditionMet &&
      (failedTimesArray.length ||
        (!failedTimesArray.length && !isBeginning))) ||
      failedTimesArray.length ||
      (!failedTimesArray.length && !isBeginning && !anyMessage))
  );
  return {
    dateIndex: iDateIndex,
    thread: oldestThread,
    isBeginning
  };
}

function mergeListOfThreads(
  threadsObjects: ThreadObject[]
): ThreadObject | null {
  if (!threadsObjects.length) {
    return null;
  }
  if (threadsObjects.length === 1) {
    return threadsObjects[0];
  }
  let acum = threadsObjects[0];
  for (const [index, thread] of Object.entries(threadsObjects)) {
    if (index === "0") {
      continue;
    }
    const merged = mergeThreads(acum, thread);
    if (merged) {
      acum = merged;
    }
  }
  return acum;
}

function getTimesInFailedPeriod(failedTimesArray: Time[]) {
  if (!failedTimesArray.length) {
    return [];
  }
  return failedTimesArray.map((time) => {
    const dateStep = getSmallerDateStep(time.dateStep);
    if (dateStep === time.dateStep) {
      return null;
    }
    const subTimePeriods: {
      startTime: Date;
      endTime: Date;
      isBeginning: boolean;
      dateStep: DateStep;
      dateStepValue: number;
      genesisDate: Date;
    }[] = [];
    let iDateIndex = 1;
    let from = time.startTime;
    while (dayjs(from).isBefore(time.endTime)) {
      const currentTime = getTimes({
        dateIndex: iDateIndex,
        dateStep,
        dateStepValue: 1,
        from: time.startTime,
        genesisDate: time.genesisDate
      });
      from = currentTime.endTime;
      iDateIndex++;
      subTimePeriods.push(currentTime);
    }
    return subTimePeriods;
  });
}

function checkDateStepValue(dateStepValue: number) {
  if (dateStepValue >= 1) {
    return true;
  }
  throw new Error(`dateStepValue has to be equal or greater than 1`); // so that it's easier to get the next smaller time unit
}
async function allSettled(promisesFns: (() => Promise<unknown> | null)[]) {
  const makeRequests = promisesFns;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: PromiseSettledResult<any>[] = [];
  let started = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recurse = (): any => {
    const i = started++;
    const makeRequest = makeRequests.shift();
    return !makeRequest
      ? null
      : Promise.allSettled([makeRequest()]).then((result) => {
          results[i] = result[0];
          return recurse();
        });
  };
  await Promise.all(Array.from({ length: concurrency }, recurse));
  return results;
}
