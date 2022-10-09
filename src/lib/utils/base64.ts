import { IpfsMetadataStorage } from "@bosonprotocol/react-kit";

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

export const loadAndSetImage = (
  image: File,
  callback: (base64Uri: string) => void
) => {
  const reader = new FileReader();
  reader.onloadend = (e: ProgressEvent<FileReader>) => {
    const prev = e.target?.result?.toString() || "";
    callback(prev);
  };
  reader.readAsDataURL(image);
};

export const loadAndSetImagePromise = (image: File) => {
  return new Promise<Parameters<Parameters<typeof loadAndSetImage>[1]>[0]>(
    (resolve) => {
      loadAndSetImage(image, resolve);
    }
  );
};

export const fetchIpfsImage = async (
  ipfsLink: string,
  ipfsMetadataStorage: IpfsMetadataStorage
) => {
  if (!ipfsMetadataStorage) {
    return;
  }

  const fetchPromises = await ipfsMetadataStorage.get(ipfsLink, false);
  const [image] = await Promise.all([fetchPromises]);
  const base64str = await blobToBase64(new Blob([image as BlobPart]));

  if (!String(base64str).includes("base64")) {
    throw new Error("Decoded image is not in base64");
  }
  return base64str;
};

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = window.atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return blob;
}
