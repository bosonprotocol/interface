export function formatAddress(address: string): string {
  if (!address) {
    return address;
  }
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4
  )}`;
}
