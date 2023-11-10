import { Provider } from "@bosonprotocol/react-kit";
import getRevertReason from "eth-revert-reason";
import { providers } from "ethers";
// You may throw an instance of this class when the user rejects a request in their wallet.
// The benefit is that you can distinguish this error from other errors using didUserReject().
export class UserRejectedRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserRejectedRequestError";
  }
}

export function toReadableError(errorText: string, error: unknown) {
  if (typeof error === "object" && error !== null) {
    const e = error as Error & { reason?: string };
    return new Error(`${errorText} 👺 ${e.message ?? e.reason ?? "unknown"}`);
  }
  return new Error(`${errorText} 👺 ${error}`);
}

export async function extractUserFriendlyError(
  error: unknown,
  {
    defaultError = "Please retry this action",
    txResponse,
    provider
  }: {
    defaultError?: string;
    txResponse?: providers.TransactionResponse;
    provider?: Provider;
  } = {}
): Promise<string> {
  try {
    if (!error || typeof error !== "object") {
      return defaultError;
    }
    if (txResponse) {
      const revertReason = await getRevertReason(
        txResponse.hash,
        "mainnet", // mumbai is not supported
        txResponse.blockNumber,
        provider
      );
      return revertReason ?? defaultError;
    }

    const m = error.toString().match(/(?<=execution reverted: ).*/)?.[0];
    const endIndex = m?.indexOf(`\\",`);
    const details = m?.substring(
      0,
      endIndex === -1 ? m?.indexOf(`",`) : endIndex
    );
    return details ?? defaultError;
  } catch (error) {
    console.error("[extractUserFriendlyError]", error);
    return defaultError;
  }
}

export function getHasUserRejectedTx(error: unknown): boolean {
  const hasUserRejectedTx =
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "ACTION_REJECTED";
  return hasUserRejectedTx;
}
