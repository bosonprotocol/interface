import { convertToBlob } from "./convertToBlob";

export type Image = {
  value: string;
  key: string;
};
export const convertImageToFile = ({ value, key }: Image) => {
  const extension = value?.split(";")?.[0]?.split("/")?.[1];
  const encoded = value?.split(",")?.[1];

  try {
    const data = convertToBlob(encoded, `image/${extension}`);
    const blob = new Blob([data as BlobPart], {
      type: `image/${extension}`
    });

    const file = new File([blob as BlobPart], `${key}.${extension}`, {
      type: `image/${extension}`
    });

    return file;
  } catch (e) {
    console.error(e);
  }
  return null;
};
