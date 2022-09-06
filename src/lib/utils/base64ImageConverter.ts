export function fromBase64ToBinary(base64: string): Buffer {
  return Buffer.from(base64.replace(/data:image\/.*;base64,/, ""), "base64");
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
