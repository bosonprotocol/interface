export function parseEligibleSellerWalletAddress(
  value?: string
): string[] | undefined {
  if (value) {
    return value
      .split(",")
      .map((address) => address.replaceAll(" ", "").toLowerCase());
  }

  return [];
}
