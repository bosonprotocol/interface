export function fromBase64ToBinary(base64: string): Buffer {
  return Buffer.from(base64.replace(/data:image\/.*;base64,/, ""), "base64");
}
