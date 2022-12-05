export function parseEligibleSellerWalletAddress(
  value?: string
): string[] | undefined {
  if (value) {
    return value.split(",").map((address) => address.trim().toLowerCase());
  }

  return undefined;
}
