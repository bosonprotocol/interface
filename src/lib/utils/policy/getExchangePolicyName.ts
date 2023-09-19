import { onlyFairExchangePolicyLabel } from "lib/constants/policies";

export const getExchangePolicyName = (
  rawPolicyName: string | undefined | null
) => {
  const name = rawPolicyName || "Unspecified";
  return name.replace("fairExchangePolicy", onlyFairExchangePolicyLabel);
};
