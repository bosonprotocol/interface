export const convertToBlob = (data: string, contentType: string) => {
  const sliceSize = 512;

  const chars = atob(data);
  const bytes = [];

  for (let offset = 0; offset < chars.length; offset += sliceSize) {
    const slice = chars.slice(offset, offset + sliceSize);

    const numbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      numbers[i] = slice.charCodeAt(i);
    }

    const byte = new Uint8Array(numbers);
    bytes.push(byte);
  }

  const blob = new Blob(bytes, { type: contentType });
  return blob;
};
