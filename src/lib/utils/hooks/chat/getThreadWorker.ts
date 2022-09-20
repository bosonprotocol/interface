import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import {
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import dayjs from "dayjs";

import { DateStep, getSmallerDateStep, getTimes, mergeThreads } from "./common";

type Time = ReturnType<typeof getTimes>;
const numRequests = 4;

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
  now
}: {
  bosonXmtp: BosonXmtpClient;
  threadId: ThreadId;
  counterParty: string;
  dateIndex: number;
  dateStep: DateStep;
  dateStepValue: number;
  now: Date;
}): Promise<{ thread: ThreadObject | null; dateIndex: number }> {
  checkDateStepValue(dateStepValue);

  let iDateIndex = dateIndex;

  let threadsWithMessages: ThreadObject[] = [];

  let hasReachedBeginning = false;
  // let anyMessage = false;
  let failedTimesArray: Time[] = [];
  // const pendingTimesArray: Time[] = [];
  // TODO:
  // acumular threadWithMessages per no perdren cap dels parallels
  // fer tantes requests com X escollides a dalt, no com time steps
  // dividir els timeSteps fallits en sub-timesteps mes petits per repetirho
  do {
    const timesArrayInRange: Time[] = hasReachedBeginning
      ? []
      : new Array(numRequests).fill(0).map((_, index) => {
          return getTimes(iDateIndex - index, dateStep, dateStepValue, now);
        });
    const timesArray = [
      ...timesArrayInRange,
      ...getTimesInFailedPeriod(failedTimesArray)
        .flat()
        .filter((v): v is Time => !!v)
    ];
    failedTimesArray = [];
    // console.log("timesArray", timesArray, {
    //   iDateIndex,
    //   dateStep
    // });
    const promises = timesArray
      .filter((times) => !times.isBeginning)
      .map((times) => {
        console.log("request in parallel", times);
        return bosonXmtp.getThread(threadId, counterParty, {
          startTime: times.startTime,
          endTime: times.endTime
        });
      });
    if (!promises.length) {
      return { thread: null, dateIndex: iDateIndex };
    }
    const settledThreads = await Promise.allSettled(promises);
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
      .map((result) => result.value);
    // console.log(
    //   "settledThreads",
    //   settledThreads,
    //   "results",
    //   threads,
    //   "failed",
    //   failedTimesArray
    // );
    hasReachedBeginning =
      hasReachedBeginning || !!timesArray.find((times) => times.isBeginning);

    threadsWithMessages = threadsWithMessages.concat(
      threads.filter((thread) => !!thread?.messages.length)
    );
    // console.log("results with messages", threadsWithMessages);

    // anyMessage = !!threadsWithMessages.length;
    iDateIndex -= numRequests;
    // } while (!hasReachedBeginning && !anyMessage && failedTimesArray.length);
  } while (failedTimesArray.length);
  // console.log("END of parallel threads", { hasReachedBeginning, anyMessage });
  if (!threadsWithMessages.length) {
    return { thread: null, dateIndex: iDateIndex };
  }
  if (threadsWithMessages.length === 1) {
    return { thread: threadsWithMessages[0], dateIndex: iDateIndex };
  }
  let acum = threadsWithMessages[0];
  for (const [index, thread] of Object.entries(threadsWithMessages)) {
    if (index === "0") {
      continue;
    }
    const merged = mergeThreads(acum, thread);
    if (merged) {
      acum = merged;
    }
  }
  return {
    thread: threadsWithMessages.length ? acum : null,
    dateIndex: iDateIndex
  };
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
    const subTimePeriods = [];
    let iDateIndex = 1;
    let from = time.startTime;
    while (dayjs(from).isBefore(time.endTime)) {
      const currentTime = getTimes(iDateIndex, dateStep, 1, time.startTime);
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
