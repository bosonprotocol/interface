import { ChangeEvent, forwardRef, useState } from "react";
import AvatarEditor, { AvatarEditorProps } from "react-avatar-editor";
import Dropzone from "react-dropzone";

import { useIpfsImage } from "../../../lib/utils/hooks/images/useIpfsImage";
import Grid from "../../ui/Grid";

export type ImageEditorProps = Pick<
  AvatarEditorProps,
  "borderRadius" | "width" | "height"
> & {
  url?: string;
};

export const ImageEditor = forwardRef<AvatarEditor, ImageEditorProps>(
  ({ url, borderRadius, width, height }, editorRef) => {
    const [scale, setScale] = useState<number>();
    const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
      const scale = parseFloat(e.target.value);
      setScale(scale);
    };
    const { data } = useIpfsImage({ url: url ?? "" }, { enabled: !!url });
    const image = data?.base64;
    const w = borderRadius
      ? undefined
      : Math.min(width || Number.MAX_SAFE_INTEGER, window.innerWidth);
    return (
      <>
        {image && (
          <div style={{ margin: "2rem 0" }}>
            <Dropzone
              data-dropzone
              noClick
              noKeyboard
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style={{
                // width: w ? w + "px" : "250px",
                // width: "100%",
                // height: height ? height + "px" : "250px",
                borderRadius: borderRadius ? `${borderRadius}%` : ""
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <AvatarEditor
                    image={image}
                    ref={editorRef}
                    width={w}
                    height={height}
                    scale={scale}
                    borderRadius={borderRadius}
                  />
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
            <Grid alignItems="center" justifyContent="center">
              Zoom:
              <input
                name="scale"
                type="range"
                onChange={handleScale}
                min={"0.1"}
                max="2"
                step="0.01"
                defaultValue="1"
              />
            </Grid>
          </div>
        )}
      </>
    );
  }
);
