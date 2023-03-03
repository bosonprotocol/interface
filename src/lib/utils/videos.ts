import { blobToBase64 } from "./base64";

export function getVideoMetadata(videoFile: File) {
  return new Promise<{
    width: number;
    height: number;
    // eslint-disable-next-line no-async-promise-executor
  }>(async (resolve, reject) => {
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      resolve({
        height: video.videoWidth,
        width: video.videoHeight
      });
    };
    video.onerror = (...errorArgs) => {
      reject(errorArgs);
    };
    const base64 = await blobToBase64(videoFile);
    video.src = base64;
  });
}
