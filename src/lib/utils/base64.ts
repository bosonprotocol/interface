import { IpfsMetadataStorage } from "@bosonprotocol/react-kit";

export async function fetchImageAsBase64(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return { base64: await blobToBase64(blob), blob };
}

export function fromBase64ToBinary(base64: string): Buffer {
  return Buffer.from(base64.replace(/data:image\/.*;base64,/, ""), "base64");
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    loadAndSetMedia(blob, resolve, reject);
  });
}

export const loadAndSetMedia = (
  fileOrBlob: File | Blob,
  callback: (base64Uri: string) => void,
  errorCallback?: (...errorArgs: unknown[]) => void
) => {
  const reader = new FileReader();
  reader.onloadend = (e: ProgressEvent<FileReader>) => {
    const prev = e.target?.result?.toString() || "";
    callback(prev);
  };
  reader.onerror = (...errorArgs) => {
    errorCallback?.(errorArgs);
  };
  reader.readAsDataURL(fileOrBlob);
};

export const loadAndSetImagePromise = (image: File): Promise<string> => {
  return new Promise<Parameters<Parameters<typeof loadAndSetMedia>[1]>[0]>(
    (resolve, reject) => {
      loadAndSetMedia(image, resolve, reject);
    }
  );
};

export const fetchIpfsBase64Media = async (
  ipfsLinks: string[],
  ipfsMetadataStorage: IpfsMetadataStorage
): Promise<string[]> => {
  if (!ipfsMetadataStorage) {
    return [];
  }
  const fetchPromises = ipfsLinks.map(async (src) => {
    const imgData = await ipfsMetadataStorage.get(src, false);
    const base64str = await blobToBase64(
      new Blob([imgData as unknown as BlobPart])
    );
    if (!String(base64str).includes("base64")) {
      throw new Error("Decoded image is not in base64");
    }
    return base64str;
  });
  const base64strList = await Promise.all(fetchPromises);
  return base64strList;
};

export const getFixedBase64FromUrl = async (
  url: string,
  ipfsMetadataStorage: IpfsMetadataStorage
): Promise<string | undefined> => {
  const [logoBase64] = await fetchIpfsBase64Media([url], ipfsMetadataStorage);
  if (!logoBase64) {
    return; // should never happen
  }
  const wrongDataFormat = "data:application/octet-stream;base64,";
  const indexWrongDataFormat = logoBase64.indexOf(wrongDataFormat);
  const fixedBase64 =
    indexWrongDataFormat === -1
      ? logoBase64
      : "data:image/jpeg;base64," +
        logoBase64.substring(indexWrongDataFormat + wrongDataFormat.length);
  return fixedBase64;
};

export function dataURItoBlob(dataURI: string): Blob {
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

export function isDataUri(dataURI: string): boolean {
  return dataURI.startsWith("data:") || dataURI.startsWith("unsafe:data:");
}
