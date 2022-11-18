export function parseEligibleSellerWalletAddress(
  value?: string
): string[] | undefined {
  if (value) {
    return value.split(",").map((address) => address.toLowerCase());
  }

  return undefined;
}
