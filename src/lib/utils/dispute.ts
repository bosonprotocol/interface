import { subgraph } from "@bosonprotocol/react-kit";

import { getDateTimestamp } from "./getDateTimestamp";

export const getDisputeDates = (
  dispute: subgraph.DisputeFieldsFragment | undefined
) => {
  const endOfResolutionPeriod = dispute?.timeout
    ? getDateTimestamp(dispute?.timeout)
    : undefined;
  const finishedResolutionPeriod = endOfResolutionPeriod
    ? Date.now() > endOfResolutionPeriod
    : false;
  return {
    endOfResolutionPeriod,
    finishedResolutionPeriod
  };
};
