export type UploadFileType = File | FileProps;

export interface FileProps {
  src: string;
  name?: string; // for example: "redeemeum.png"
  size?: number;
  type: string; // for example: "image/png"
  width?: number | null;
  height?: number | null;
}
