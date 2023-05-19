import React, { ChangeEvent, forwardRef, useState } from "react";
import AvatarEditor, { AvatarEditorProps } from "react-avatar-editor";
import Dropzone from "react-dropzone";

import { useIpfsImage } from "../../../lib/utils/hooks/images/useIpfsImage";

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
    return (
      <>
        {image && (
          <>
            <Dropzone
              noClick
              noKeyboard
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style={{
                width: width ? width + "px" : "250px",
                height: height ? height + "px" : "250px",
                borderRadius: borderRadius ? `${borderRadius}%` : ""
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <AvatarEditor
                    image={image}
                    ref={editorRef}
                    width={width}
                    height={height}
                    scale={scale}
                    borderRadius={borderRadius}
                  />
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
            <div>
              Zoom:{" "}
              <input
                name="scale"
                type="range"
                onChange={handleScale}
                min={"1"}
                max="2"
                step="0.01"
                defaultValue="1"
              />
            </div>
          </>
        )}
      </>
    );
  }
);
