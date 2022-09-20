import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import {
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";

import { DateStep, getTimes, mergeThreads } from "./common";

const numRequests = 4;
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
  let iDateIndex = dateIndex;

  let threadsWithMessages: ThreadObject[] = [];

  let lastRequests = false;
  let anyMessage = false;
  do {
    const timesArray = new Array(numRequests).fill(0).map((_, index) => {
      return getTimes(iDateIndex - index, dateStep, dateStepValue, now);
    });
    const failedTimesArray: typeof timesArray = []; // TODO: what should be do?

    console.log("timesArray", timesArray, { iDateIndex, dateStep });
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
    console.log("results", threads);
    lastRequests = !!timesArray.find((times) => times.isBeginning);

    threadsWithMessages = threads.filter((thread) => !!thread?.messages.length);
    console.log("results with messages", threadsWithMessages);

    anyMessage = !!threadsWithMessages.length;
    iDateIndex -= numRequests;
  } while (!lastRequests && !anyMessage);
  console.log("END of parallel threads", { lastRequests, anyMessage });
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
