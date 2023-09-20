import { TermsOfExchange } from "components/product/utils";
import { CONFIG } from "lib/config";

export function getDisputePeriodDurationInMS(
  termsOfExchange: TermsOfExchange["termsOfExchange"]
): number {
  const disputePeriodDurationInMS =
    parseInt(termsOfExchange.disputePeriod) * 24 * 3600 * 1000; // day to msec
  return disputePeriodDurationInMS;
}

export function getResolutionPeriodDurationInMS(): number {
  const resolutionPeriodDurationInMS =
    parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600 * 1000; // day to msec
  return resolutionPeriodDurationInMS;
}

export function getDisputeResolverContactMethod(): string {
  const disputeResolverContactMethod = `email to: ${CONFIG.defaultDisputeResolverContactMethod}`;
  return disputeResolverContactMethod;
}
