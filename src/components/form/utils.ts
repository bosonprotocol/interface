/* eslint @typescript-eslint/no-explicit-any: "off" */
export const checkIfValueIsEmpty = (v: any) =>
  v == null ||
  (Object.prototype.hasOwnProperty.call(v, "length") && v.length === 0) ||
  (v.constructor === Object && Object.keys(v).length === 0);

export const convertToBlob = (data: any, contentType: string) => {
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
